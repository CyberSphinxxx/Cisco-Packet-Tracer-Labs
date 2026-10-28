/**
 * Markdown rendering safety and fidelity: AST-only link rewriting, sanitized
 * HTML, GitHub-compatible anchors, CRLF tolerance.
 */
import { describe, expect, it } from 'vitest';
import { ContentError } from '../../src/lib/content/errors';
import { collectHeadings, renderMarkdown, type HrefResolver } from '../../src/lib/content/markdown';

/** Resolver that tags every local link so rewrites are visible. */
const tagging: HrefResolver = (href) => {
  if (/^https?:/.test(href)) return { url: href, kind: 'external' };
  if (href.startsWith('#')) return { url: href, kind: 'fragment' };
  return { url: `/RESOLVED/${href}`, kind: 'route' };
};

const render = (md: string, resolve: HrefResolver = tagging) => renderMarkdown(md, { resolve });

describe('link rewriting is AST-based', () => {
  it('rewrites links, images and reference definitions', () => {
    const { html } = render('See [a](x.md) and ![i](img.png) and [ref][r].\n\n[r]: other.md\n');
    expect(html).toContain('href="/RESOLVED/x.md"');
    expect(html).toContain('src="/RESOLVED/img.png"');
    expect(html).toContain('href="/RESOLVED/other.md"');
  });

  it('never rewrites link-like text inside fenced code or inline code', () => {
    const md = 'Use `[x](../../../etc/passwd)` here.\n\n```text\nR1(config)# banner motd #[x](evil.md)#\n![img](a.png)\n```\n';
    const { html } = render(md, () => {
      throw new Error('resolver must not be called for code');
    });
    expect(html).toContain('[x](../../../etc/passwd)');
    expect(html).toContain('banner motd #[x](evil.md)#');
    expect(html).toContain('![img](a.png)');
  });

  it('marks external links and pkt downloads', () => {
    const { html } = renderMarkdown('[ext](https://www.cisco.com/) [pkt](assets/starter.pkt)', {
      resolve: (h) => (h.startsWith('http') ? { url: h, kind: 'external' } : { url: `/files/${h}`, kind: 'file' }),
    });
    expect(html).toMatch(/<a href="https:\/\/www\.cisco\.com\/" data-link-kind="external" rel="noopener noreferrer external">/);
    expect(html).toMatch(/<a href="\/files\/assets\/starter\.pkt" data-link-kind="file" download>/);
  });

  it('propagates resolver errors (build must fail on bad links)', () => {
    expect(() =>
      render('[bad](javascript:alert(1))', () => {
        throw new ContentError('unsafe', 'x.md');
      }),
    ).toThrow(ContentError);
  });
});

describe('untrusted HTML is neutralized', () => {
  it('escapes script tags and event handlers instead of rendering them', () => {
    const md = '<script>alert(1)</script>\n\nText <img src=x onerror=alert(2)> and <iframe src="//evil"></iframe>\n';
    const { html } = render(md);
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/<img[^>]*onerror/i);
    expect(html).not.toMatch(/<iframe/i);
    expect(html).toContain('&#x3C;script>alert(1)&#x3C;/script>');
  });

  it('keeps <br> inside table cells as a real line break', () => {
    const { html } = render('| a | b |\n|---|---|\n| one<br>two | x |\n');
    expect(html).toMatch(/one<br>\s*two/);
    expect(html).toContain('class="table-scroll"');
    expect(html).toMatch(/role="region" tabindex="0" aria-label="Table 1: /);
  });
});

describe('headings and anchors', () => {
  it('uses GitHub-compatible ids, including duplicates and inline code', () => {
    const md = '# Title\n\n## Files and Validation Status\n\n## Verification\n\n### 1. Verify `show ip route` Output\n\n## Verification\n';
    const ids = collectHeadings(md).map((h) => h.id);
    expect(ids).toEqual(['title', 'files-and-validation-status', 'verification', '1-verify-show-ip-route-output', 'verification-1']);
    const { html, headings } = renderMarkdown(md, { resolve: tagging, dropFirstH1: true });
    expect(html).not.toContain('<h1');
    expect(headings.map((h) => h.id)).toEqual(ids.slice(1));
    expect(html).toContain('<h2 id="files-and-validation-status">');
    expect(html).toContain('href="#files-and-validation-status"');
  });

  it('renders identically from CRLF and LF sources', () => {
    const lf = '# T\n\nLead.\n\n## A\n\n| x | y |\n|---|---|\n| 1 | 2 |\n\n```text\nshow run\n```\n';
    expect(render(lf.replace(/\n/g, '\r\n')).html).toBe(render(lf).html);
  });
});

describe('presentation transforms', () => {
  it('wraps code blocks with a progressive-enhancement copy button', () => {
    const { html } = render('```text\nenable\n```\n');
    expect(html).toMatch(/<div class="code-block"><button type="button" class="copy-code" hidden data-pagefind-ignore="">Copy<\/button><pre tabindex="0"><code class="language-text">/);
  });

  it('turns a lone image paragraph into a captioned figure', () => {
    const { html } = render('![PTL-0008 Topology Diagram](assets/topology.png)\n');
    expect(html).toContain('<figure class="md-figure"><a href="/RESOLVED/assets/topology.png" class="figure-link"');
    expect(html).toContain('<figcaption>PTL-0008 Topology Diagram</figcaption>');
  });

  it('renders GitHub alert blockquotes as labeled callouts', () => {
    const { html } = render('> [!IMPORTANT]\n> **Disclaimer:** not affiliated.\n');
    expect(html).toContain('<div class="callout callout-important" role="note"><p class="callout-title">Important</p>');
    expect(html).not.toContain('[!IMPORTANT]');
  });
});
