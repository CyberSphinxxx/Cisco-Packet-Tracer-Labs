/**
 * Presentation helpers shared by pages. No content lives here: everything
 * is derived from the repository view models.
 */
import { getRepository, type Lab, type Repository } from './content/repository';

export const SITE_NAME = 'Cisco Packet Tracer Learning Library';
export const SHORT_NAME = 'Packet Tracer Learning Library';

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

export function navItems(repo: Repository = getRepository()): NavItem[] {
  const items: NavItem[] = [
    { label: 'Labs', href: url('/labs/'), match: url('/labs/') },
    { label: 'Learning paths', href: url('/learning-paths/'), match: url('/learning-paths/') },
    { label: 'Reference guides', href: url('/docs/'), match: url('/docs/') },
  ];
  const capstone = repo.projects[0];
  if (capstone) items.push({ label: 'Capstone', href: capstone.route, match: url('/projects/') });
  return items;
}

/**
 * T568B wire codes in pin order. Categories take codes in curated order
 * (first appearance in the learning paths), solid colours first, then the
 * white-striped variants, so a new category automatically gets the next code.
 */
const WIRES = [
  { color: 'orange', striped: false, name: 'orange' },
  { color: 'green', striped: false, name: 'green' },
  { color: 'blue', striped: false, name: 'blue' },
  { color: 'brown', striped: false, name: 'brown' },
  { color: 'orange', striped: true, name: 'white-orange' },
  { color: 'green', striped: true, name: 'white-green' },
  { color: 'blue', striped: true, name: 'white-blue' },
  { color: 'brown', striped: true, name: 'white-brown' },
] as const;

export type Wire = (typeof WIRES)[number];

export function wireFor(category: string, repo: Repository = getRepository()): Wire {
  const i = repo.categories.findIndex((c) => c.slug === category);
  return WIRES[(i < 0 ? 0 : i) % WIRES.length];
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

/** Learning paths that include a lab, with the step number. */
export function pathsContaining(labId: string, repo: Repository = getRepository()) {
  return repo.paths
    .map((p) => ({ path: p, step: p.steps.find((s) => s.labId === labId) }))
    .filter((x): x is { path: (typeof repo.paths)[number]; step: NonNullable<typeof x.step> } => Boolean(x.step));
}
