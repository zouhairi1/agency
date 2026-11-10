import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { pbLoader } from './lib/pbLoader';

// French = main fields, English = *_en fields (empty → falls back to French on /en/).

const order = z.number().default(0);
const file = z.url().optional();
const text = z.string().default('');
const json = <T extends z.ZodType>(schema: T) => z.preprocess((v) => (v === null || v === '' ? undefined : v), schema);

const seo = {
  seo_title: text,
  seo_description: text,
  og_image: file,
};

const services = defineCollection({
  loader: pbLoader({ collection: 'services', sort: 'order', fileFields: ['icon', 'og_image'] }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    title_en: text,
    slug: z.string(),
    outcome: text,
    outcome_en: text,
    description: text,
    description_en: text,
    capabilities: json(z.array(z.string()).default([])),
    icon: file,
    order,
    ...seo,
  }),
});

const projects = defineCollection({
  loader: pbLoader({
    collection: 'projects',
    filter: 'published = true',
    sort: 'order,-year',
    expand: 'services',
    fileFields: ['cover', 'hero_video', 'gallery', 'og_image'],
  }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    title_en: text,
    slug: z.string(),
    client: z.string(),
    summary: text,
    summary_en: text,
    cover: file,
    hero_video: file,
    gallery: z.array(z.url()).default([]),
    category: z.array(z.string()).default([]),
    industry: text,
    stack: json(z.array(z.string()).default([])),
    year: z.number().optional(),
    live_url: text,
    results: json(z.array(z.object({ value: z.string(), label: z.string(), label_en: z.string().optional() })).default([])),
    challenge: text,
    challenge_en: text,
    approach: text,
    approach_en: text,
    body: text,
    body_en: text,
    featured: z.boolean().default(false),
    order,
    ...seo,
    seo_title_en: text,
    seo_description_en: text,
  }),
});

const testimonials = defineCollection({
  loader: pbLoader({ collection: 'testimonials', sort: 'order', fileFields: ['photo', 'video'] }),
  schema: z.object({
    quote: z.string(),
    quote_en: text,
    name: z.string(),
    role: text,
    role_en: text,
    company: text,
    photo: file,
    video: file,
    order,
  }),
});

const clients = defineCollection({
  loader: pbLoader({ collection: 'clients', sort: 'order', fileFields: ['logo'] }),
  schema: z.object({ name: z.string(), logo: file, url: text, order }),
});

const stats = defineCollection({
  loader: pbLoader({ collection: 'stats', sort: 'order' }),
  schema: z.object({
    label: z.string(),
    label_en: text,
    value: z.number(),
    prefix: text,
    suffix: text,
    order,
  }),
});

// Project scoper options: duration only, no price fields by design.
const estimatorOptions = defineCollection({
  loader: pbLoader({ collection: 'estimator_options', sort: 'group,order', fileFields: ['icon'] }),
  schema: z.object({
    id: z.string(),
    group: z.enum(['project_type', 'feature', 'timeline', 'addon']),
    label: z.string(),
    label_en: text,
    description: text,
    description_en: text,
    base_weeks: z.number().default(0),
    icon: file,
    order,
  }),
});

const posts = defineCollection({
  loader: pbLoader({
    collection: 'posts',
    filter: 'published = true',
    sort: '-published_at',
    expand: 'author',
    fileFields: ['cover'],
  }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    title_en: text,
    slug: z.string(),
    excerpt: text,
    excerpt_en: text,
    cover: file,
    category: text,
    body: text,
    body_en: text,
    published_at: text,
    expand: z.object({ author: z.object({ name: z.string(), role: text, role_en: text }).optional() }).optional(),
  }),
});

export const collections = {
  posts,
  services,
  projects,
  testimonials,
  clients,
  stats,
  estimator_options: estimatorOptions,
};
