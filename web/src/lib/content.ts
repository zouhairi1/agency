import { getCollection, type CollectionEntry } from 'astro:content';
import { pick, type Locale } from '../i18n/config';
import {
  SHOW_PLACEHOLDERS,
  fallbackScoperOptions,
  fallbackServices,
  placeholderProjects,
  placeholderStats,
  placeholderTestimonials,
  type ScoperOption,
} from '../data/site';

/** A project localized for one language. */
export function localizeProject(data: CollectionEntry<'projects'>['data'], locale: Locale) {
  return {
    ...data,
    title: pick(data, 'title', locale),
    summary: pick(data, 'summary', locale),
    challenge: pick(data, 'challenge', locale),
    approach: pick(data, 'approach', locale),
    body: pick(data, 'body', locale),
    seo_title: pick(data, 'seo_title', locale),
    seo_description: pick(data, 'seo_description', locale),
    results: data.results.map((r) => ({ value: r.value, label: (locale === 'en' && r.label_en) || r.label })),
  };
}

/**
 * Everything the home page needs, localized.
 * Proof sections (work, stats, testimonials) are empty on the live site until real content exists;
 * in local dev they show clearly-labelled placeholders.
 */
export async function getHomeContent(locale: Locale) {
  const [projects, services, stats, testimonials, clients, options] = await Promise.all([
    getCollection('projects'),
    getCollection('services'),
    getCollection('stats'),
    getCollection('testimonials'),
    getCollection('clients'),
    getCollection('estimator_options'),
  ]);

  // The content store is keyed by slug, so always sort explicitly.
  const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;
  projects.sort(byOrder);
  services.sort(byOrder);
  stats.sort(byOrder);
  testimonials.sort(byOrder);
  clients.sort(byOrder);
  options.sort(byOrder);

  const all = projects.map((p) => localizeProject(p.data, locale));
  const featured = all.filter((p) => p.featured);
  const work = (featured.length ? featured : all).slice(0, 6);

  const scoperOptions: ScoperOption[] = options.length
    ? options
        .map((o) => o.data)
        .filter((o): o is typeof o & { group: 'project_type' | 'feature' } => o.group === 'project_type' || o.group === 'feature')
        .map((o) => ({
          id: o.id,
          group: o.group,
          label: pick(o, 'label', locale),
          description: pick(o, 'description', locale),
          base_weeks: o.base_weeks,
        }))
    : fallbackScoperOptions[locale];

  return {
    work: work.length ? work : SHOW_PLACEHOLDERS ? placeholderProjects : [],
    workLinkable: work.length > 0,
    services: services.length
      ? services.map((s) => ({
          title: pick(s.data, 'title', locale),
          outcome: pick(s.data, 'outcome', locale),
          capabilities: s.data.capabilities,
          icon: s.data.icon,
        }))
      : fallbackServices[locale],
    stats: stats.length
      ? stats.map((s) => ({ ...s.data, label: pick(s.data, 'label', locale) }))
      : SHOW_PLACEHOLDERS ? placeholderStats : [],
    testimonials: testimonials.length
      ? testimonials.map((t) => ({
          ...t.data,
          quote: pick(t.data, 'quote', locale),
          role: pick(t.data, 'role', locale),
        }))
      : SHOW_PLACEHOLDERS ? placeholderTestimonials : [],
    // Client logo strip only when real clients exist (the tech stack has its own section).
    marquee: clients.map((c) => c.data),
    scoperOptions,
    posts: (await postsFor(locale)).slice(0, 3),
  };
}

export async function getProjects(locale: Locale) {
  const entries = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
  const projects = entries.map((e) => localizeProject(e.data, locale));
  return {
    projects: projects.length ? projects : SHOW_PLACEHOLDERS ? placeholderProjects : [],
    linkable: projects.length > 0,
  };
}

export async function getProjectPaths(locale: Locale) {
  const entries = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
  return entries.map((entry, i) => ({
    params: { slug: entry.data.slug },
    props: {
      project: localizeProject(entry.data, locale),
      next: entries.length > 1 ? localizeProject(entries[(i + 1) % entries.length].data, locale) : undefined,
    },
  }));
}

export type LocalizedProject = ReturnType<typeof localizeProject>;

// ---------- Blog ----------

/** A blog post localized for one language. English pages only list posts that have an English translation. */
export function localizePost(data: CollectionEntry<'posts'>['data'], locale: Locale) {
  const body = pick(data, 'body', locale);
  const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const author = data.expand?.author;
  return {
    slug: data.slug,
    title: pick(data, 'title', locale),
    excerpt: pick(data, 'excerpt', locale),
    body,
    cover: data.cover,
    category: data.category,
    date: data.published_at ? new Date(data.published_at) : undefined,
    readingTime: Math.max(1, Math.ceil(words / 200)),
    author: author ? { name: author.name, role: pick(author, 'role', locale) } : undefined,
  };
}

export type LocalizedPost = ReturnType<typeof localizePost>;

async function postsFor(locale: Locale) {
  const entries = (await getCollection('posts')).sort((a, b) => b.data.published_at.localeCompare(a.data.published_at));
  return entries
    .filter((e) => locale === 'fr' || (e.data.title_en && e.data.body_en))
    .map((e) => localizePost(e.data, locale));
}

export const getPosts = postsFor;

export async function getPostPaths(locale: Locale) {
  const posts = await postsFor(locale);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post, related: posts.filter((p) => p.slug !== post.slug).slice(0, 2) },
  }));
}

export function formatDate(date: Date | undefined, locale: Locale) {
  return date ? new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date) : '';
}
