/**
 * AST-based Markdown rendering for canonical repository documents.
 *
 * Pipeline: remark-parse -> remark-gfm -> (raw HTML neutralization, heading
 * ids, link/image rewriting on mdast) -> remark-rehype -> rehype-sanitize ->
 * trusted presentation transforms -> rehype-stringify.
 *
 * Links are rewritten only on `link`, `image` and `definition` nodes, so code
 * fences and inline code are never touched. Untrusted HTML is sanitized
 * before any trusted attributes are added.
 */
import GithubSlugger from 'github-slugger';
import type { Element, ElementContent, Root as HastRoot } from 'hast';
import { toString as hastToString } from 'hast-util-to-string';
import type { Blockquote, Heading, Html, Image, Link, Definition, Paragraph, Root as MdastRoot, RootContent } from 'mdast';
import { toString as mdastToString } from 'mdast-util-to-string';
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { SKIP, visit } from 'unist-util-visit';

export type LinkKind = 'route' | 'file' | 'github' | 'external' | 'mailto' | 'fragment';

export interface ResolvedLink {
  url: string;
  kind: LinkKind;
  /** Pixel size for images when known (prevents layout shift). */
  width?: number;
  height?: number;
}

/** Resolves a raw Markdown href. Must throw a ContentError for invalid links. */
export type HrefResolver = (href: string, as: 'link' | 'image') => ResolvedLink;

export interface HeadingInfo {
  depth: number;
  id: string;
  text: string;
}

export interface RenderResult {
  html: string;
  headings: HeadingInfo[];
  /** Text of the first H1, if any. */
  title: string | null;
  /** Plain text of the first paragraph after the H1 (for descriptions). */
  lead: string | null;
}

export interface RenderOptions {
  resolve: HrefResolver;
  /** Remove the first H1 from the body (the page renders its own H1). */
  dropFirstH1?: boolean;
}

const BR = /^<br\s*\/?>$/i;

function parse(markdown: string): MdastRoot {
  const processor = unified().use(remarkParse).use(remarkGfm);
  return processor.runSync(processor.parse(markdown.replace(/\r\n?/g, '\n'))) as MdastRoot;
}

/**
 * Assign GitHub-compatible heading ids (github-slugger over the heading's
 * text content, duplicates suffixed -1, -2...). Shared by the link-index pass
 * and the render pass so fragment validation and output always agree.
 */
function assignHeadingIds(tree: MdastRoot): HeadingInfo[] {
  const slugger = new GithubSlugger();
  const headings: HeadingInfo[] = [];
  visit(tree, 'heading', (node: Heading) => {
    const text = mdastToString(node).trim();
    const id = slugger.slug(text);
    node.data = { ...(node.data ?? {}), hProperties: { ...((node.data?.hProperties as object) ?? {}), id } };
    headings.push({ depth: node.depth, id, text });
  });
  return headings;
}

/** Heading ids of a document, without rendering it (pass 1 of the build). */
export function collectHeadings(markdown: string): HeadingInfo[] {
  return assignHeadingIds(parse(markdown));
}

/** Plain text of the first H1 and first paragraph (used for titles/descriptions). */
export function extractTitleAndLead(markdown: string): { title: string | null; lead: string | null } {
  const tree = parse(markdown);
  let title: string | null = null;
  let lead: string | null = null;
  for (const node of tree.children) {
    if (!title && node.type === 'heading' && node.depth === 1) title = mdastToString(node).trim();
    else if (title && !lead && node.type === 'paragraph') {
      lead = mdastToString(node).replace(/\s+/g, ' ').trim();
      break;
    }
  }
  return { title, lead };
}

/** Replace raw HTML: `<br>` becomes a hard break, anything else literal text. */
function neutralizeHtml(tree: MdastRoot) {
  visit(tree, 'html', (node: Html, index, parent) => {
    if (!parent || index === undefined) return;
    const value = node.value.trim();
    let replacement: RootContent;
    if (BR.test(value)) replacement = { type: 'break' };
    else if (parent.type === 'root' || parent.type === 'blockquote' || parent.type === 'listItem') {
      replacement = { type: 'paragraph', children: [{ type: 'text', value: node.value }] } as Paragraph;
    } else replacement = { type: 'text', value: node.value };
    (parent.children as RootContent[])[index] = replacement;
    return [SKIP, index + 1];
  });
}

const ALERT = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i;

/** GitHub alert syntax (`> [!IMPORTANT]`) -> blockquote tagged for a styled callout. */
function markAlerts(tree: MdastRoot) {
  visit(tree, 'blockquote', (node: Blockquote) => {
    const first = node.children[0];
    if (first?.type !== 'paragraph') return;
    const lead = first.children[0];
    if (lead?.type !== 'text') return;
    const m = ALERT.exec(lead.value);
    if (!m) return;
    lead.value = lead.value.slice(m[0].length);
    if (!lead.value) first.children.shift();
    if (first.children[0]?.type === 'break') first.children.shift();
    if (first.children.length === 0) node.children.shift();
    node.data = { ...(node.data ?? {}), hProperties: { dataCallout: m[1].toLowerCase() } };
  });
}

function rewriteLinks(tree: MdastRoot, resolve: HrefResolver) {
  visit(tree, (node) => {
    if (node.type === 'link' || node.type === 'definition') {
      const n = node as Link | Definition;
      const r = resolve(n.url, 'link');
      n.url = r.url;
      if (node.type === 'link') {
        const props: Record<string, string | boolean> = { dataLinkKind: r.kind };
        if (r.kind === 'external') props.rel = 'noopener noreferrer external';
        if (r.kind === 'file' && /\.pkt$/i.test(r.url)) props.download = true;
        n.data = { ...(n.data ?? {}), hProperties: props };
      }
    } else if (node.type === 'image') {
      const n = node as Image;
      const r = resolve(n.url, 'image');
      n.url = r.url;
      const props: Record<string, string | number> = { loading: 'lazy', decoding: 'async' };
      if (r.width && r.height) {
        props.width = r.width;
        props.height = r.height;
      }
      n.data = { ...(n.data ?? {}), hProperties: props };
    }
  });
}

/** Sanitizer schema: GitHub-like defaults plus the attributes our own plugins add. */
const sanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  // Heading ids are generated by us from text via github-slugger; keep them
  // unprefixed so canonical GitHub anchors (#learning-objectives) keep working.
  clobber: [],
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), 'rel', 'download', 'dataLinkKind'],
    img: [...(defaultSchema.attributes?.img ?? []), 'loading', 'decoding', 'width', 'height'],
    h1: ['id'],
    h2: ['id'],
    h3: ['id'],
    h4: ['id'],
    h5: ['id'],
    h6: ['id'],
    code: [['className', /^language-[\w-]+$/]],
    blockquote: [['dataCallout', 'note', 'tip', 'important', 'warning', 'caution']],
  },
  protocols: { ...defaultSchema.protocols, href: ['http', 'https', 'mailto'], src: ['http', 'https'] },
};

function el(tagName: string, properties: Element['properties'], children: ElementContent[] = []): Element {
  return { type: 'element', tagName, properties, children };
}

/** Trusted, post-sanitize presentation: anchors, scrollable tables, code blocks, figures. */
function enhance(tree: HastRoot) {
  let lastHeading = 'Content';
  let tableCount = 0;
  visit(tree, 'element', (node: Element, index, parent) => {
    if (/^h[2-4]$/.test(node.tagName) && typeof node.properties?.id === 'string') {
      lastHeading = hastToString(node).trim();
      node.children.push(
        el('a', { className: ['heading-anchor'], href: `#${node.properties.id}`, ariaLabel: `Link to section: ${lastHeading}`, dataPagefindIgnore: '' }, [
          { type: 'text', value: '#' },
        ]),
      );
      return SKIP;
    }
    if (node.tagName === 'blockquote' && typeof node.properties?.dataCallout === 'string') {
      const type = node.properties.dataCallout;
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      node.tagName = 'div';
      node.properties = { className: ['callout', `callout-${type}`], role: 'note' };
      node.children.unshift(el('p', { className: ['callout-title'] }, [{ type: 'text', value: label }]));
      return undefined;
    }
    if (!parent || index === undefined) return;
    if (node.tagName === 'table') {
      tableCount += 1;
      const wrapper = el(
        'div',
        { className: ['table-scroll'], role: 'region', tabIndex: 0, ariaLabel: `Table ${tableCount}: ${lastHeading}` },
        [node],
      );
      parent.children[index] = wrapper;
      return SKIP;
    }
    if (node.tagName === 'pre') {
      node.properties = { ...node.properties, tabIndex: 0 };
      const wrapper = el('div', { className: ['code-block'] }, [
        el('button', { type: 'button', className: ['copy-code'], hidden: true, dataPagefindIgnore: '' }, [{ type: 'text', value: 'Copy' }]),
        node,
      ]);
      parent.children[index] = wrapper;
      return SKIP;
    }
    // A paragraph that only contains one image becomes a captioned figure.
    if (node.tagName === 'p') {
      const meaningful = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
      const only = meaningful[0];
      if (meaningful.length === 1 && only.type === 'element' && only.tagName === 'img') {
        const src = String(only.properties?.src ?? '');
        const alt = String(only.properties?.alt ?? '');
        const figure = el('figure', { className: ['md-figure'] }, [
          el('a', { href: src, className: ['figure-link'], title: 'Open full-size image' }, [only]),
          ...(alt ? [el('figcaption', {}, [{ type: 'text', value: alt }])] : []),
        ]);
        parent.children[index] = figure;
        return SKIP;
      }
    }
    return undefined;
  });
}

export function renderMarkdown(markdown: string, options: RenderOptions): RenderResult {
  const tree = parse(markdown);
  neutralizeHtml(tree);
  markAlerts(tree);
  let headings = assignHeadingIds(tree);
  const { title, lead } = extractTitleAndLead(markdown);

  if (options.dropFirstH1) {
    const i = tree.children.findIndex((n) => n.type === 'heading' && n.depth === 1);
    if (i !== -1) {
      const removed = tree.children.splice(i, 1)[0] as Heading;
      const removedId = (removed.data?.hProperties as { id?: string } | undefined)?.id;
      headings = headings.filter((h) => !(h.depth === 1 && h.id === removedId));
    }
  }

  rewriteLinks(tree, options.resolve);

  const hast = unified().use(remarkRehype).runSync(tree) as HastRoot;
  const sanitized = unified().use(rehypeSanitize, sanitizeSchema).runSync(hast) as HastRoot;
  enhance(sanitized);
  const html = unified().use(rehypeStringify).stringify(sanitized);
  return { html, headings, title, lead };
}
