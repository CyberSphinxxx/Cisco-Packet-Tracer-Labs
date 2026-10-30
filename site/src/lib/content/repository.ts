/**
 * Build-time content graph for the Cisco Packet Tracer Learning Library.
 *
 * Reads the canonical repository folders read-only, joins every lab's
 * `README.md` with its adjacent `metadata.json` by folder path (never by
 * array position or title), validates, renders, and returns immutable view
 * models. Nothing here keeps a hand-maintained list of labs, paths or docs:
 * adding a valid `labs/<category>/<slug>/` folder adds a page.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { List, ListItem, Root as MdastRoot } from 'mdast';
import { toString as mdastToString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { getSourceConfig, type SourceConfig } from './config';
import { ContentError } from './errors';
import { collectHeadings, renderMarkdown, type HeadingInfo } from './markdown';
import { exists, isFile, listDirs, listFiles, readText, toOs } from './paths';
import { createResolver, githubUrl, joinBase, pngSize, publishedFileUrl, type IndexedDocument, type ResolverEnv } from './resolver';
import { formatIssues, labMetadataSchema, type LabMetadata } from './schema';

export interface PublishedFile {
  /** Repository-relative POSIX path; also the URL path under the site base. */
  repoPath: string;
  url: string;
  bytes: number;
  sha256: string;
}

export interface Download extends PublishedFile {
  fileName: string;
  role: 'starter' | 'completed';
}

export interface ImageAsset extends PublishedFile {
  width?: number;
  height?: number;
}

export interface ConfigFile extends PublishedFile {
  name: string;
  /** Device label derived from the file name (e.g. R1). */
  device: string;
  content: string;
}

export interface RenderedDoc {
  sourcePath: string;
  githubUrl: string;
  html: string;
  headings: HeadingInfo[];
  /** h2/h3 entries for the table of contents. */
  toc: HeadingInfo[];
}

export interface VerificationPage extends RenderedDoc {
  route: string;
  title: string;
  parentRoute: string;
  parentTitle: string;
}

export interface Lab {
  id: string;
  title: string;
  slug: string;
  category: string;
  route: string;
  summary: string;
  difficulty: LabMetadata['difficulty'];
  topics: string[];
  objectives: string[];
  minutes: number | null;
  devices: string[];
  packetTracerVersion: string | null;
  activityReference: string | null;
  documentationStatus: LabMetadata['status']['documentation'];
  simulatorStatus: LabMetadata['status']['simulator'];
  simulatorEvidenceUrl: string | null;
  references: string[];
  lastReviewed: string | null;
  sourceType: LabMetadata['source']['type'];
  licenseDecision: string;
  starter: Download | null;
  completed: Download | null;
  topology: ImageAsset | null;
  configs: ConfigFile[];
  verification: VerificationPage | null;
  doc: RenderedDoc;
  /** Position in the curated learning order (first appearance in learning paths), 1-based. */
  learningOrder: number;
}

export interface Project {
  slug: string;
  title: string;
  route: string;
  summary: string | null;
  starter: Download | null;
  completed: Download | null;
  topology: ImageAsset | null;
  configs: ConfigFile[];
  verification: VerificationPage | null;
  doc: RenderedDoc;
  /** Labs linked from the project README, in order of first mention. */
  linkedLabIds: string[];
}

export interface PathStep {
  order: number;
  label: string;
  url: string;
  kind: 'lab' | 'project' | 'doc' | 'path' | 'other';
  labId: string | null;
  description: string;
  section: string | null;
  group: string | null;
}

export interface LearningPath {
  slug: string;
  title: string;
  route: string;
  summary: string | null;
  steps: PathStep[];
  doc: RenderedDoc;
}

export interface DocPage {
  slug: string;
  title: string;
  route: string;
  summary: string | null;
  doc: RenderedDoc;
}

export interface Category {
  slug: string;
  label: string;
  route: string;
  labIds: string[];
}

export interface ExcludedLab {
  sourcePath: string;
  reason: string;
}

export interface Repository {
  config: SourceConfig & { base: string };
  labs: Lab[];
  projects: Project[];
  paths: LearningPath[];
  docs: DocPage[];
  categories: Category[];
  topics: { slug: string; label: string; count: number }[];
  files: PublishedFile[];
  excluded: ExcludedLab[];
}

export interface LoadOptions extends Partial<SourceConfig> {
  base?: string;
}

const ACRONYMS: Record<string, string> = {
  ip: 'IP', ipv4: 'IPv4', ipv6: 'IPv6', ios: 'IOS', vlan: 'VLAN', vlans: 'VLANs', ospf: 'OSPF', ospfv2: 'OSPFv2',
  dhcp: 'DHCP', dhcpv4: 'DHCPv4', acl: 'ACL', acls: 'ACLs', ssh: 'SSH', lacp: 'LACP', stp: 'STP', dtp: 'DTP',
  cli: 'CLI', nvram: 'NVRAM', mac: 'MAC', svi: 'SVI', wan: 'WAN', lan: 'LAN', rsa: 'RSA', bpdu: 'BPDU',
  dns: 'DNS', icmp: 'ICMP', tcp: 'TCP', udp: 'UDP', nat: 'NAT', ccna: 'CCNA', bsit: 'BSIT', vty: 'VTY',
  '802.1q': '802.1Q', dot1q: '802.1Q', cdp: 'CDP', lldp: 'LLDP', aaa: 'AAA', motd: 'MOTD', ipv6addressing: 'IPv6 Addressing',
  vlsm: 'VLSM', flsm: 'FLSM', arp: 'ARP', cidr: 'CIDR', etherchannel: 'EtherChannel', portfast: 'PortFast',
};
const SMALL = new Set(['and', 'or', 'of', 'the', 'a', 'an', 'on', 'in', 'to', 'for', 'with']);

/** Human label for a metadata slug (`network-security` -> `Network Security`, `ip-addressing` -> `IP Addressing`). */
export function labelFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((w, i) => ACRONYMS[w] ?? (i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

function sha256(abs: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
}

function parseMdast(markdown: string): MdastRoot {
  const p = unified().use(remarkParse).use(remarkGfm);
  return p.runSync(p.parse(markdown)) as MdastRoot;
}

/** Ordered link targets (raw hrefs) in a Markdown document, in source order. */
function linkHrefs(markdown: string): string[] {
  const hrefs: string[] = [];
  visit(parseMdast(markdown), 'link', (n: { url: string }) => {
    hrefs.push(n.url);
  });
  return hrefs;
}

interface DocSource {
  rel: string;
  route: string;
  markdown: string;
  headings: HeadingInfo[];
}

export function loadRepository(options: LoadOptions = {}): Repository {
  const cfg = getSourceConfig(options);
  const base = options.base ?? process.env.PTL_BASE ?? '/';
  const root = cfg.repoRoot;
  const route = (p: string) => joinBase(base, p);

  const documents = new Map<string, IndexedDocument>();
  const sources = new Map<string, DocSource>();
  const register = (rel: string, r: string) => {
    if (sources.has(rel)) throw new ContentError('document registered twice', rel);
    const markdown = readText(root, rel);
    const headings = collectHeadings(markdown);
    for (const [, doc] of documents) {
      if (doc.route === r) throw new ContentError(`route collision on ${r}`, rel);
    }
    documents.set(rel, { route: r, headingIds: new Set(headings.map((h) => h.id)) });
    sources.set(rel, { rel, route: r, markdown, headings });
  };

  // ---- Pass 1: discover and index every publishable document ---------------
  interface LabSource { dir: string; meta: LabMetadata }
  const labSources: LabSource[] = [];
  const excluded: ExcludedLab[] = [];
  const ids = new Map<string, string>();
  const slugs = new Map<string, string>();

  for (const category of listDirs(root, 'labs')) {
    for (const slug of listDirs(root, `labs/${category}`)) {
      const dir = `labs/${category}/${slug}`;
      const metaRel = `${dir}/metadata.json`;
      if (!isFile(root, metaRel)) throw new ContentError('lab folder is missing metadata.json', dir);
      if (!isFile(root, `${dir}/README.md`)) throw new ContentError('lab folder is missing README.md', dir);
      let raw: unknown;
      try {
        raw = JSON.parse(readText(root, metaRel));
      } catch (e) {
        throw new ContentError(`invalid JSON: ${(e as Error).message}`, metaRel);
      }
      const parsed = labMetadataSchema.safeParse(raw);
      if (!parsed.success) throw new ContentError(`metadata does not match schema: ${formatIssues(parsed.error)}`, metaRel);
      const meta = parsed.data;
      if (meta.category !== category) throw new ContentError(`category "${meta.category}" does not match folder "${category}"`, metaRel);
      if (meta.slug !== slug) throw new ContentError(`slug "${meta.slug}" does not match folder "${slug}"`, metaRel);
      if (ids.has(meta.id)) throw new ContentError(`duplicate lab id ${meta.id} (also in ${ids.get(meta.id)})`, metaRel);
      if (slugs.has(meta.slug)) throw new ContentError(`duplicate lab slug ${meta.slug} (also in ${slugs.get(meta.slug)})`, metaRel);
      ids.set(meta.id, metaRel);
      slugs.set(meta.slug, metaRel);
      if (meta.source.type === 'restricted') {
        throw new ContentError('restricted content must not live in public labs/ (see AI_AGENT_GUIDE rights policy)', metaRel);
      }
      if (meta.source.type === 'external_reference' || meta.status.documentation === 'draft') {
        excluded.push({ sourcePath: dir, reason: `${meta.source.type}/${meta.status.documentation} is not published` });
        continue;
      }
      labSources.push({ dir, meta });
      register(`${dir}/README.md`, route(`/labs/${category}/${slug}/`));
      if (isFile(root, `${dir}/verification.md`)) register(`${dir}/verification.md`, route(`/labs/${category}/${slug}/verification/`));
    }
  }

  const projectDirs = listDirs(root, 'projects').filter((d) => isFile(root, `projects/${d}/README.md`));
  for (const slug of projectDirs) {
    register(`projects/${slug}/README.md`, route(`/projects/${slug}/`));
    if (isFile(root, `projects/${slug}/verification.md`)) register(`projects/${slug}/verification.md`, route(`/projects/${slug}/verification/`));
  }
  const pathFiles = listFiles(root, 'learning-paths', '.md');
  for (const f of pathFiles) register(`learning-paths/${f}`, route(`/learning-paths/${f.replace(/\.md$/, '')}/`));
  const docFiles = listFiles(root, 'docs', '.md');
  for (const f of docFiles) register(`docs/${f}`, route(`/docs/${f.replace(/\.md$/, '')}/`));

  // ---- Pass 2: render with source-relative link resolution -----------------
  const publishedFiles = new Set<string>();
  const env: ResolverEnv = { repoRoot: root, repoUrl: cfg.repoUrl, sourceRef: cfg.sourceRef, base, documents, publishedFiles };

  const render = (rel: string, dropFirstH1 = true): RenderedDoc & { title: string | null; lead: string | null } => {
    const src = sources.get(rel);
    if (!src) throw new ContentError('document was not indexed', rel);
    const out = renderMarkdown(src.markdown, { resolve: createResolver(env, rel), dropFirstH1 });
    return {
      sourcePath: rel,
      githubUrl: githubUrl(cfg, rel),
      html: out.html,
      headings: out.headings,
      toc: out.headings.filter((h) => h.depth === 2 || h.depth === 3),
      title: out.title,
      lead: out.lead,
    };
  };

  const fileInfo = (rel: string): PublishedFile => {
    const abs = toOs(root, rel);
    const bytes = fs.statSync(abs).size;
    if (bytes === 0) throw new ContentError('published file is empty', rel);
    publishedFiles.add(rel);
    return { repoPath: rel, url: publishedFileUrl(base, rel), bytes, sha256: sha256(abs) };
  };

  const download = (rel: string, role: Download['role']): Download => {
    if (!isFile(root, rel)) throw new ContentError(`declared ${role} file is missing`, rel);
    if (!rel.toLowerCase().endsWith('.pkt')) throw new ContentError(`${role} download must be a .pkt file`, rel);
    return { ...fileInfo(rel), fileName: path.posix.basename(rel), role };
  };

  const image = (rel: string): ImageAsset => {
    if (!isFile(root, rel)) throw new ContentError('declared topology image is missing', rel);
    const size = rel.toLowerCase().endsWith('.png') ? pngSize(toOs(root, rel)) : undefined;
    if (rel.toLowerCase().endsWith('.png') && !size) throw new ContentError('topology is not a valid PNG', rel);
    return { ...fileInfo(rel), ...size };
  };

  const configs = (dir: string): ConfigFile[] =>
    listFiles(root, `${dir}/configs`, '.txt').map((name) => {
      const rel = `${dir}/configs/${name}`;
      return { ...fileInfo(rel), name, device: name.replace(/\.txt$/i, ''), content: readText(root, rel) };
    });

  const verificationPage = (dir: string, parentRoute: string, parentTitle: string): VerificationPage | null => {
    const rel = `${dir}/verification.md`;
    if (!sources.has(rel)) return null;
    const r = render(rel);
    return { ...r, route: sources.get(rel)!.route, title: r.title ?? `Verification: ${parentTitle}`, parentRoute, parentTitle };
  };

  /** Lab-relative asset path from metadata, normalized and confined to the lab folder. */
  const assetPath = (dir: string, rel: string): string => {
    const joined = path.posix.normalize(path.posix.join(dir, rel));
    if (!joined.startsWith(`${dir}/`)) throw new ContentError(`asset path escapes the lab folder: ${rel}`, `${dir}/metadata.json`);
    return joined;
  };

  // Learning paths first: they define the curated learning order.
  const pathOrder = orderedPathFiles(root, pathFiles);
  const labByReadme = new Map(labSources.map((l) => [`${l.dir}/README.md`, l]));
  const paths: LearningPath[] = pathOrder.map((f) => {
    const rel = `learning-paths/${f}`;
    const r = render(rel);
    const steps = extractSteps(sources.get(rel)!.markdown, rel, env, labByReadme);
    return { slug: f.replace(/\.md$/, ''), title: r.title ?? f, route: sources.get(rel)!.route, summary: r.lead, steps, doc: r };
  });

  const learningOrder = new Map<string, number>();
  for (const p of paths) for (const s of p.steps) if (s.labId && !learningOrder.has(s.labId)) learningOrder.set(s.labId, learningOrder.size + 1);
  const unordered = labSources.map((l) => l.meta.id).filter((id) => !learningOrder.has(id)).sort();
  for (const id of unordered) learningOrder.set(id, learningOrder.size + 1);

  const labs: Lab[] = labSources.map(({ dir, meta }) => {
    const readmeRel = `${dir}/README.md`;
    const doc = render(readmeRel);
    const r = sources.get(readmeRel)!.route;
    let evidenceUrl: string | null = null;
    if (meta.status.simulator_evidence) {
      const ev = meta.status.simulator_evidence.replace(/\\/g, '/');
      // Repo-root-relative per the metadata contract; fall back to lab-relative like the Python validator.
      const evRel = exists(root, ev) ? ev : exists(root, `${dir}/${ev}`) ? `${dir}/${ev}` : null;
      if (!evRel) throw new ContentError(`simulator_evidence file not found: ${ev}`, `${dir}/metadata.json`);
      evidenceUrl = githubUrl(cfg, evRel);
    } else if (meta.status.simulator === 'tested_pass') {
      throw new ContentError('tested_pass requires simulator_evidence', `${dir}/metadata.json`);
    }
    return {
      id: meta.id,
      title: meta.title,
      slug: meta.slug,
      category: meta.category,
      route: r,
      summary: meta.summary,
      difficulty: meta.difficulty,
      topics: meta.topics,
      objectives: meta.learning_objectives,
      minutes: meta.estimated_minutes,
      devices: meta.devices,
      packetTracerVersion: meta.packet_tracer_version,
      activityReference: meta.activity_reference,
      documentationStatus: meta.status.documentation,
      simulatorStatus: meta.status.simulator,
      simulatorEvidenceUrl: evidenceUrl,
      references: meta.references,
      lastReviewed: meta.last_reviewed,
      sourceType: meta.source.type,
      licenseDecision: meta.license_decision,
      starter: meta.assets.starter ? download(assetPath(dir, meta.assets.starter), 'starter') : null,
      completed: meta.assets.completed ? download(assetPath(dir, meta.assets.completed), 'completed') : null,
      topology: meta.assets.topology ? image(assetPath(dir, meta.assets.topology)) : null,
      configs: configs(dir),
      verification: verificationPage(dir, r, meta.title),
      doc,
      learningOrder: learningOrder.get(meta.id)!,
    };
  });
  for (const lab of labs) {
    if (lab.simulatorStatus === 'tested_pass' && lab.starter && lab.completed && lab.starter.sha256 === lab.completed.sha256) {
      throw new ContentError('starter and completed files are identical (not allowed for tested_pass)', `labs/${lab.category}/${lab.slug}/metadata.json`);
    }
  }
  labs.sort((a, b) => a.learningOrder - b.learningOrder);

  const readmeToLabId = new Map(labSources.map((l) => [`${l.dir}/README.md`, l.meta.id]));
  const projects: Project[] = projectDirs.map((slug) => {
    const dir = `projects/${slug}`;
    const rel = `${dir}/README.md`;
    const r = render(rel);
    const conv = (name: string) => (isFile(root, `${dir}/assets/${name}`) ? `${dir}/assets/${name}` : null);
    const linked: string[] = [];
    for (const href of linkHrefs(sources.get(rel)!.markdown)) {
      if (/^[a-z][a-z0-9+.-]*:|^#/i.test(href)) continue;
      const target = path.posix.normalize(path.posix.join(dir, href.split('#')[0]));
      const id = readmeToLabId.get(target);
      if (id && !linked.includes(id)) linked.push(id);
    }
    const starter = conv('starter.pkt');
    const completed = conv('completed.pkt');
    const topo = conv('topology.png');
    return {
      slug,
      title: r.title ?? labelFromSlug(slug),
      route: sources.get(rel)!.route,
      summary: r.lead,
      starter: starter ? download(starter, 'starter') : null,
      completed: completed ? download(completed, 'completed') : null,
      topology: topo ? image(topo) : null,
      configs: configs(dir),
      verification: verificationPage(dir, sources.get(rel)!.route, r.title ?? slug),
      doc: r,
      linkedLabIds: linked,
    };
  });

  const docs: DocPage[] = docFiles.map((f) => {
    const rel = `docs/${f}`;
    const r = render(rel);
    return { slug: f.replace(/\.md$/, ''), title: r.title ?? labelFromSlug(f.replace(/\.md$/, '')), route: sources.get(rel)!.route, summary: r.lead, doc: r };
  });

  // Categories in curated order: first appearance of their labs in the learning order.
  const categories: Category[] = [];
  for (const lab of labs) {
    let c = categories.find((x) => x.slug === lab.category);
    if (!c) {
      c = { slug: lab.category, label: labelFromSlug(lab.category), route: route(`/labs/${lab.category}/`), labIds: [] };
      categories.push(c);
    }
    c.labIds.push(lab.id);
  }

  const topicCounts = new Map<string, number>();
  for (const lab of labs) for (const t of lab.topics) topicCounts.set(t, (topicCounts.get(t) ?? 0) + 1);
  const topics = [...topicCounts]
    .map(([slug, count]) => ({ slug, label: labelFromSlug(slug), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'en'));

  const files = [...publishedFiles]
    .sort()
    .map((rel) => {
      const abs = toOs(root, rel);
      return { repoPath: rel, url: publishedFileUrl(base, rel), bytes: fs.statSync(abs).size, sha256: sha256(abs) };
    });

  return { config: { ...cfg, base }, labs, projects, paths, docs, categories, topics, files, excluded };
}

/** Learning paths in the order the root README lists them; unlisted paths follow alphabetically. */
function orderedPathFiles(root: string, files: string[]): string[] {
  const order: string[] = [];
  if (isFile(root, 'README.md')) {
    for (const href of linkHrefs(readText(root, 'README.md'))) {
      const m = /^(?:\.\/)?learning-paths\/([^/#?]+\.md)/.exec(href);
      if (m && files.includes(m[1]) && !order.includes(m[1])) order.push(m[1]);
    }
  }
  return [...order, ...files.filter((f) => !order.includes(f))];
}

/**
 * Steps of a learning path: every list item (ordered or not) whose first
 * paragraph starts with a link (optionally inside **bold**), in source order.
 * The nearest preceding h2/h3 headings become the step's group/section.
 */
function extractSteps(markdown: string, rel: string, env: ResolverEnv, labByReadme: Map<string, { meta: LabMetadata }>): PathStep[] {
  const tree = parseMdast(markdown);
  const steps: PathStep[] = [];
  let group: string | null = null;
  let section: string | null = null;
  const resolve = createResolver(env, rel);

  const firstLink = (item: ListItem) => {
    const para = item.children[0];
    if (para?.type !== 'paragraph') return null;
    let lead = para.children.find((c) => !(c.type === 'text' && !c.value.trim()));
    if (lead?.type === 'strong' && lead.children.length === 1) lead = lead.children[0];
    return lead?.type === 'link' ? { link: lead, para } : null;
  };

  for (const node of tree.children) {
    if (node.type === 'heading') {
      const text = mdastToString(node).trim();
      if (node.depth === 2) {
        group = text;
        section = null;
      } else if (node.depth === 3) section = text;
      continue;
    }
    if (node.type !== 'list') continue;
    for (const item of (node as List).children) {
      const found = firstLink(item);
      if (!found) continue;
      const href = found.link.url;
      const resolved = resolve(href, 'link');
      let kind: PathStep['kind'] = 'other';
      let labId: string | null = null;
      if (!/^[a-z][a-z0-9+.-]*:|^#/i.test(href)) {
        const target = path.posix.normalize(path.posix.join(path.posix.dirname(rel), href.split('#')[0]));
        const lab = labByReadme.get(target);
        if (lab) {
          kind = 'lab';
          labId = lab.meta.id;
        } else if (target.startsWith('projects/')) kind = 'project';
        else if (target.startsWith('docs/')) kind = 'doc';
        else if (target.startsWith('learning-paths/')) kind = 'path';
      }
      const all = mdastToString(item).replace(/\s+/g, ' ').trim();
      const label = mdastToString(found.link).trim();
      const description = all.startsWith(label) ? all.slice(label.length).trim() : all;
      steps.push({ order: steps.length + 1, label, url: resolved.url, kind, labId, description, section, group });
    }
  }
  return steps;
}

let cached: Repository | undefined;

/** Memoized repository for page rendering (one load per build process). */
export function getRepository(): Repository {
  cached ??= loadRepository();
  return cached;
}
