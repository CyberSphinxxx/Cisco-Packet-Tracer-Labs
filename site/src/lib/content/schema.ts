/**
 * Schema for the canonical per-lab `metadata.json`.
 *
 * It mirrors the enumerations in `tools/validate_repo.py` (the repository's
 * existing source of truth) so the website never accepts a value the Python
 * validator would reject. The README files have no frontmatter; this JSON is
 * the only structured source.
 */
import { z } from 'astro/zod';

export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;
export const SOURCE_TYPES = ['original', 'permission_verified', 'external_reference', 'restricted'] as const;
export const DOC_STATES = ['draft', 'reviewed', 'published'] as const;
export const SIM_STATES = ['not_tested', 'tested_pass', 'tested_fail', 'not_applicable'] as const;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Topics may contain dots (e.g. `802.1q-trunking`); the Python validator does not restrict them further. */
const topicPattern = /^[a-z0-9][a-z0-9.]*(?:-[a-z0-9.]+)*$/;
const relativeAsset = z
  .string()
  .min(1)
  .refine((v) => !v.includes('://') && !v.startsWith('/') && !v.includes('\\'), {
    message: 'must be a forward-slash path relative to the lab folder',
  })
  .refine((v) => !v.split('/').includes('..'), { message: 'must stay inside the lab folder (no .. segments)' });

export const labMetadataSchema = z.object({
  id: z.string().regex(/^PTL-\d{4}$/, 'id must look like PTL-0000'),
  title: z.string().min(1),
  slug: z.string().regex(slugPattern),
  category: z.string().regex(slugPattern),
  summary: z.string().min(1),
  difficulty: z.enum(DIFFICULTIES),
  topics: z.array(z.string().regex(topicPattern)),
  learning_objectives: z.array(z.string().min(1)),
  estimated_minutes: z.number().int().positive().nullable(),
  activity_reference: z.string().nullable(),
  packet_tracer_version: z.string().nullable(),
  devices: z.array(z.string()),
  source: z.object({
    type: z.enum(SOURCE_TYPES),
    origin: z.string().nullable().optional(),
    url: z.string().nullable().optional(),
    permission_evidence: z.string().nullable().optional(),
  }),
  license_decision: z.string().min(1),
  assets: z.object({
    starter: relativeAsset.nullable(),
    completed: relativeAsset.nullable(),
    topology: relativeAsset.nullable(),
  }),
  status: z.object({
    documentation: z.enum(DOC_STATES),
    simulator: z.enum(SIM_STATES),
    simulator_evidence: z.string().nullable().optional(),
  }),
  references: z.array(z.string().regex(/^https?:\/\//, 'references must be http(s) URLs')),
  last_reviewed: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
});

export type LabMetadata = z.infer<typeof labMetadataSchema>;

/** Format zod issues as one readable line per problem. */
export function formatIssues(error: z.ZodError): string {
  return error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`).join('; ');
}
