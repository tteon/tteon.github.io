import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const EXPERIMENT_CATEGORIES = [
  'Graph Runtime & Storage',
  'Ontology & GraphRAG Construction',
  'Agent Interfaces & Coordination',
  'LLM Serving & KV-Cache',
  'Verification, Code Graphs & Postmortems',
] as const;

const experiments = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experiments' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(EXPERIMENT_CATEGORIES).default('Ontology & GraphRAG Construction'),
    host: z.string(),
    hypothesis: z.string(),
    falsification: z.string().optional(),
    verdict: z.enum(['Supported', 'Refuted', 'Mixed', 'Inconclusive']),
    keyMetric: z.string(),
    takeaways: z.array(z.string()).default([]),
    soWhat: z.string().optional(),
    related: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    beadsId: z.string().optional(),
    repoUrl: z.string().optional(),
    commit: z.string().optional(),
    environment: z
      .object({
        machine: z.string().optional(),
        runtime: z.string().optional(),
        dataset: z.string().optional(),
        repeats: z.string().optional(),
        artifactSha256: z.string().optional(),
      })
      .optional(),
    figures: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string(),
        })
      )
      .default([]),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['Architecture', 'Systems', 'Note']).default('Note'),
    readingTime: z.string().optional(),
    takeaways: z.array(z.string()).default([]),
    soWhat: z.string().optional(),
    related: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    sourceNote: z.string().optional(),
  }),
});

export const collections = { experiments, writing };
