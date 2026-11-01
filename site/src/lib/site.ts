/**
 * Presentation helpers shared by pages. No content lives here: everything
 * is derived from the repository view models.
 */
import { getRepository, type Lab, type Repository } from './content/repository';

export const SITE_NAME = 'itnetworking';
export const SHORT_NAME = 'itnetworking';
export const TAGLINE = 'Packet Tracer labs and networking tools';

export function url(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}${path.startsWith('/') ? path : `/${path}`}`;
}

export interface NavItem {
  label: string;
  href: string;
  /** Active when the current path starts with this prefix. */
  match: string;
}

/**
 * The header's three sections. The capstone project stays reachable from the
 * footer, the labs catalogue and the learning paths.
 */
export function navItems(): NavItem[] {
  return [
    { label: 'Labs', href: url('/labs/'), match: url('/labs/') },
    { label: 'Learning paths', href: url('/learning-paths/'), match: url('/learning-paths/') },
    { label: 'Guides', href: url('/docs/'), match: url('/docs/') },
  ];
}

/** The beginner learning path (by slug), else the first path the README lists. */
export function beginnerPath(repo: Repository = getRepository()) {
  return repo.paths.find((p) => /beginner/.test(p.slug)) ?? repo.paths[0];
}

/** Labs of a learning path, in path order (each lab once). */
export function pathLabs(path: Repository['paths'][number] | undefined, repo: Repository = getRepository()): Lab[] {
  if (!path) return [];
  const ids = [...new Set(path.steps.filter((s) => s.labId).map((s) => s.labId!))];
  return ids.map((id) => labById(id, repo)).filter((l): l is Lab => Boolean(l));
}

/** "Start with lab 1": the first lab of the beginner path, else the first lab in learning order. */
export function startLab(repo: Repository = getRepository()): Lab | undefined {
  return pathLabs(beginnerPath(repo), repo)[0] ?? repo.labs[0];
}

/** Topics that say nothing on their own here: "Cisco IOS" and the category names. */
function genericTopics(repo: Repository): Set<string> {
  return new Set(['cisco-ios', ...repo.categories.map((c) => c.slug)]);
}

/** Configurable topics across the labs, in learning order (generic ones left out). */
export function labTopics(repo: Repository = getRepository()): string[] {
  const generic = genericTopics(repo);
  return [...new Set(repo.labs.flatMap((l) => l.topics))].filter((t) => !generic.has(t));
}

/**
 * Short shortcut links for the hero ("Popular:"): the most advanced lab in
 * each topic area that the beginner path does not already list, then the
 * remaining ones, most advanced first. Each is named by its most specific
 * topic (the rarest across the library), e.g. "OSPF" or "ACLs".
 */
export function popularLabs(repo: Repository = getRepository(), limit = 5): { lab: Lab; label: string }[] {
  const beginner = new Set(pathLabs(beginnerPath(repo), repo).map((l) => l.id));
  const pool = repo.labs.filter((l) => !beginner.has(l.id)).sort((a, b) => b.learningOrder - a.learningOrder);
  const picked: Lab[] = [];
  for (const c of repo.categories) {
    const lab = pool.find((l) => l.category === c.slug);
    if (lab) picked.push(lab);
  }
  for (const l of pool) if (!picked.includes(l)) picked.push(l);
  const counts = new Map(repo.topics.map((t) => [t.slug, t.count]));
  const generic = genericTopics(repo);
  const out: { lab: Lab; label: string }[] = [];
  for (const lab of picked) {
    const specific = lab.topics.filter((t) => !generic.has(t));
    if (!specific.length) continue;
    const topic = specific.reduce((best, t) => ((counts.get(t) ?? 0) < (counts.get(best) ?? 0) ? t : best));
    const label = repo.topics.find((t) => t.slug === topic)?.label ?? topic;
    if (!out.some((o) => o.label === label)) out.push({ lab, label });
    if (out.length === limit) break;
  }
  return out;
}

export function categoryLabel(slug: string, repo: Repository = getRepository()): string {
  return repo.categories.find((c) => c.slug === slug)?.label ?? slug;
}

export function difficultyLabel(d: string): string {
  return d.charAt(0).toUpperCase() + d.slice(1);
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(n < 10 * 1024 ? 1 : 0)} KB`;
}

export function minutesLabel(m: number | null): string {
  return m == null ? 'Time not estimated' : `${m} min`;
}

const SIM_LABELS: Record<string, string> = {
  tested_pass: 'Tested in Packet Tracer',
  tested_fail: 'Simulator test failed',
  not_tested: 'Not yet tested in Packet Tracer',
  not_applicable: 'No simulator file',
};

export function simulatorLabel(status: string): string {
  return SIM_LABELS[status] ?? status;
}

export function labById(id: string, repo: Repository = getRepository()): Lab | undefined {
  return repo.labs.find((l) => l.id === id);
}

/** Previous/next lab in the curated learning order. */
export function neighbours(lab: Lab, repo: Repository = getRepository()) {
  const i = repo.labs.findIndex((l) => l.id === lab.id);
  return { prev: repo.labs[i - 1] ?? null, next: repo.labs[i + 1] ?? null };
}

/** Related labs: shared topics first (excluding the ubiquitous ones), then same category. */
export function relatedLabs(lab: Lab, repo: Repository = getRepository(), limit = 3): Lab[] {
  const common = new Set(repo.topics.filter((t) => t.count > repo.labs.length / 2).map((t) => t.slug));
  return repo.labs
    .filter((l) => l.id !== lab.id)
    .map((l) => ({
      l,
      score: l.topics.filter((t) => !common.has(t) && lab.topics.includes(t)).length * 2 + (l.category === lab.category ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.l.learningOrder - b.l.learningOrder)
    .slice(0, limit)
    .map((x) => x.l);
}

/**
 * A short name for a lab where space is tight (the homepage path track),
 * derived from its title: the first clause, without a leading verb such as
 * "Configuring" or the vendor name. "Configuring Cisco Router Interfaces"
 * becomes "Router Interfaces"; "MAC Address Learning and ARP Operation"
 * becomes "MAC Address Learning". The full title stays available as a tooltip.
 */
const FRIENDLY_LAB_TITLES: Record<string, string> = {
  'PTL-0008': 'Your first commands',
  'PTL-0002': 'Router interfaces',
  'PTL-0005': 'Check connected networks',
  'PTL-0015': 'Subnetting',
  'PTL-0016': 'MAC addresses and ARP',
  'PTL-0009': 'VLANs',
  'PTL-0014': 'Default gateways',
};

export function shortLabTitle(title: string, id?: string): string {
  if (id && FRIENDLY_LAB_TITLES[id]) return FRIENDLY_LAB_TITLES[id];
  let t = title.split(/:\s| - | and | with /)[0].trim();
  t = t.replace(/^(Configuring|Configure|Verifying|Verify|Implementing|Implement|Understanding|Introduction to)\s+/i, '');
  t = t.replace(/^Cisco\s+(?=\S)/, '');
  return t || title;
}

/** "about 4 hours" / "45 min" for a list of labs (labs without an estimate count as zero). */
export function totalTimeLabel(labs: Lab[]): string {
  const total = labs.reduce((n, l) => n + (l.minutes ?? 0), 0);
  if (total < 60) return `${total} min`;
  const hours = Math.round(total / 60);
  return `about ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
}

/** One entry in the instant search index (search-index.json). */
export interface SearchEntry {
  kind: 'lab' | 'project' | 'path' | 'guide';
  url: string;
  title: string;
  /** Lab ID, e.g. PTL-0009 (labs only). */
  id?: string;
  /** One line under the title, e.g. "Switching · Beginner · 35 min". */
  meta: string;
  summary: string;
  /** Specific topics, as plain words, for the "Covers" line. */
  covers: string[];
  starter?: { url: string; fileName: string };
  /** Lower-case text the client matches against (title, ID, topics, objectives...). */
  terms: string;
}

export interface SearchIndex {
  entries: SearchEntry[];
  /** URLs suggested before anything is typed (the first lab, then popular ones). */
  featured: string[];
}

/** The instant search index, built from the same view models as the pages. */
export function searchIndex(repo: Repository = getRepository()): SearchIndex {
  const generic = genericTopics(repo);
  const topicLabel = (slug: string) => repo.topics.find((t) => t.slug === slug)?.label ?? slug;
  const join = (...parts: (string | null | undefined)[]) => parts.filter(Boolean).join(' ').toLowerCase();
  const labs: SearchEntry[] = repo.labs.map((lab) => {
    const category = categoryLabel(lab.category, repo);
    const specific = lab.topics.filter((t) => !generic.has(t));
    return {
      kind: 'lab',
      url: lab.route,
      title: lab.title,
      id: lab.id,
      meta: [category, difficultyLabel(lab.difficulty), lab.minutes != null ? `${lab.minutes} min` : null].filter(Boolean).join(' · '),
      summary: lab.summary,
      covers: specific.slice(0, 3).map((t) => t.replace(/-/g, ' ')),
      ...(lab.starter ? { starter: { url: lab.starter.url, fileName: lab.starter.fileName } } : {}),
      terms: join(lab.id, lab.id.replace(/^PTL-0*/, ''), lab.title, category, lab.difficulty, ...lab.topics.map((t) => `${t.replace(/-/g, ' ')} ${topicLabel(t)}`), ...lab.objectives, ...lab.devices),
    };
  });
  const projects: SearchEntry[] = repo.projects.map((p) => ({
    kind: 'project', url: p.route, title: p.title, meta: 'Capstone project', summary: p.summary ?? '', covers: [],
    ...(p.starter ? { starter: { url: p.starter.url, fileName: p.starter.fileName } } : {}),
    terms: join(p.title, 'capstone project'),
  }));
  const paths: SearchEntry[] = repo.paths.map((p) => ({
    kind: 'path', url: p.route, title: p.title, meta: `Learning path · ${pathLabs(p, repo).length} labs`, summary: p.summary ?? '', covers: [],
    terms: join(p.title, 'learning path'),
  }));
  const guides: SearchEntry[] = repo.docs.map((d) => ({
    kind: 'guide', url: d.route, title: d.title, meta: 'Guide', summary: d.summary ?? '', covers: [],
    terms: join(d.title, d.slug.replace(/-/g, ' '), 'guide'),
  }));
  const start = startLab(repo);
  const featured = [...new Set([start?.route, ...popularLabs(repo).map((p) => p.lab.route)].filter((u): u is string => Boolean(u)))].slice(0, 6);
  return { entries: [...labs, ...projects, ...paths, ...guides], featured };
}

/** Learning paths that include a lab, with the step number. */
export function pathsContaining(labId: string, repo: Repository = getRepository()) {
  return repo.paths
    .map((p) => ({ path: p, step: p.steps.find((s) => s.labId === labId) }))
    .filter((x): x is { path: (typeof repo.paths)[number]; step: NonNullable<typeof x.step> } => Boolean(x.step));
}
