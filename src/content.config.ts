import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const experiments = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experiments' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    host: z.string(),
    hypothesis: z.string(),
    verdict: z.enum(['Supported', 'Refuted', 'Mixed', 'Inconclusive']),
    keyMetric: z.string(),
    repoUrl: z.string().optional(),
    commit: z.string().optional(),
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
    readingTime: z.string().default('5 min'),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    sourceNote: z.string().optional(),
  }),
});

export const collections = { experiments, writing };
