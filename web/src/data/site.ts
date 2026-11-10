import type { Locale } from '../i18n/config';

/**
 * Site-wide settings and fallback content.
 * Real content comes from PocketBase. Fallbacks:
 *  - structural copy (services, scoper options) is used whenever PocketBase is empty;
 *  - proof content (projects, stats, testimonials) is DEV-ONLY placeholder data and is
 *    never published: on the live site those sections are hidden until real content exists.
 */
export const site = {
  name: '[AGENCY]',
  email: import.meta.env.PUBLIC_CONTACT_EMAIL || 'hello@example.com',
  whatsapp: import.meta.env.PUBLIC_WHATSAPP_NUMBER || '',
  bookingUrl: import.meta.env.PUBLIC_BOOKING_URL || '',
  offices: [{ city: { fr: 'Maroc', en: 'Morocco' }, timeZone: 'Africa/Casablanca' }],
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Behance', href: 'https://www.behance.net/' },
    { label: 'GitHub', href: 'https://github.com/' },
  ],
};

export const SHOW_PLACEHOLDERS = import.meta.env.DEV;

/**
 * The two founders. Add your names and photos here when ready
 * (photo: put the file in web/public/team/ and set e.g. photo: '/team/omar.jpg').
 * Roles and descriptions are translated in i18n/ui.ts (founders.people).
 */
export const founders: { name: string; photo?: string; linkedin?: string }[] = [
  { name: '' },
  { name: '' },
];

type L<T> = Record<Locale, T>;

export const fallbackServices: L<{ title: string; outcome: string; capabilities: string[] }[]> = {
  fr: [
    { title: 'Sites & applications web', outcome: 'Des produits rapides et évolutifs que vos utilisateurs adorent.', capabilities: ['Astro / Next.js', 'Back-offices', 'API'] },
    { title: 'Applications mobiles', outcome: 'Des apps iOS & Android au ressenti natif.', capabilities: ['React Native', 'Expo', 'Mode hors-ligne'] },
    { title: 'Design produit & UX/UI', outcome: 'Des interfaces qui convertissent et séduisent.', capabilities: ['Design system', 'Prototypage', 'Recherche utilisateur'] },
    { title: 'IA & automatisation', outcome: 'Des produits plus intelligents, des opérations plus légères.', capabilities: ['Fonctionnalités LLM', 'Agents', 'Automatisation'] },
    { title: 'Branding & expériences créatives', outcome: 'Sites primés et expériences 3D.', capabilities: ['WebGL', 'Motion design', 'Identité visuelle'] },
  ],
  en: [
    { title: 'Web Platforms & Web Apps', outcome: 'Fast, scalable products your users love.', capabilities: ['Astro / Next.js', 'Dashboards', 'APIs'] },
    { title: 'Mobile Apps', outcome: 'Native-feeling iOS & Android apps.', capabilities: ['React Native', 'Expo', 'Offline-first'] },
    { title: 'Product & UX/UI Design', outcome: 'Interfaces that convert and delight.', capabilities: ['Design systems', 'Prototyping', 'Research'] },
    { title: 'AI & Automation', outcome: 'Smarter products and leaner operations.', capabilities: ['LLM features', 'Agents', 'Workflow automation'] },
    { title: 'Brand & Creative Development', outcome: 'Award-level websites and 3D experiences.', capabilities: ['WebGL', 'Motion', 'Brand identity'] },
  ],
};

/** Project scoper defaults (duration only, never prices). Editable later in PocketBase `estimator_options`. */
export interface ScoperOption {
  id: string;
  group: 'project_type' | 'feature';
  label: string;
  description: string;
  base_weeks: number;
}

const scoperBase = [
  { id: 'landing', group: 'project_type', weeks: 2, fr: ['Landing page', 'Une page de conversion'], en: ['Landing page', 'A single conversion page'] },
  { id: 'website', group: 'project_type', weeks: 5, fr: ['Site vitrine', 'Site multi-pages avec CMS'], en: ['Marketing website', 'Multi-page site with CMS'] },
  { id: 'ecommerce', group: 'project_type', weeks: 8, fr: ['E-commerce', 'Boutique en ligne & paiements'], en: ['E-commerce', 'Online store & payments'] },
  { id: 'webapp', group: 'project_type', weeks: 10, fr: ['Application web / SaaS', 'Plateforme avec comptes utilisateurs'], en: ['Web app / SaaS', 'Platform with user accounts'] },
  { id: 'mobile', group: 'project_type', weeks: 12, fr: ['Application mobile', 'iOS & Android'], en: ['Mobile app', 'iOS & Android'] },
  { id: 'multilingual', group: 'feature', weeks: 1, fr: ['Multilingue', 'FR / EN / AR'], en: ['Multilingual', 'FR / EN / AR'] },
  { id: 'accounts', group: 'feature', weeks: 2, fr: ['Comptes & connexion', 'Inscription, rôles, espace client'], en: ['Accounts & login', 'Sign-up, roles, client area'] },
  { id: 'payments', group: 'feature', weeks: 2, fr: ['Paiement en ligne', 'CMI, Stripe, PayPal…'], en: ['Online payments', 'Stripe, PayPal, CMI…'] },
  { id: 'dashboard', group: 'feature', weeks: 3, fr: ['Back-office / tableau de bord', 'Gestion des données & statistiques'], en: ['Admin dashboard', 'Data management & analytics'] },
  { id: 'integrations', group: 'feature', weeks: 2, fr: ['Intégrations', 'CRM, ERP, API tierces'], en: ['Integrations', 'CRM, ERP, third-party APIs'] },
  { id: 'ai', group: 'feature', weeks: 3, fr: ['Fonctionnalités IA', 'Chatbot, recherche, automatisation'], en: ['AI features', 'Chatbot, search, automation'] },
  { id: 'motion', group: 'feature', weeks: 2, fr: ['Animations & 3D', 'Expérience premium WebGL'], en: ['Motion & 3D', 'Premium WebGL experience'] },
] as const;

export const fallbackScoperOptions: L<ScoperOption[]> = {
  fr: scoperBase.map((o) => ({ id: o.id, group: o.group, label: o.fr[0], description: o.fr[1], base_weeks: o.weeks })),
  en: scoperBase.map((o) => ({ id: o.id, group: o.group, label: o.en[0], description: o.en[1], base_weeks: o.weeks })),
};

// ---------- DEV-ONLY placeholders (never shown on the live site) ----------

export const placeholderProjects = [
  { slug: 'placeholder-1', title: 'Placeholder project', client: 'Client A', summary: 'Replace with a real case study in PocketBase', category: ['web'], year: 2026 },
  { slug: 'placeholder-2', title: 'Placeholder project', client: 'Client B', summary: 'Replace with a real case study in PocketBase', category: ['mobile'], year: 2026 },
  { slug: 'placeholder-3', title: 'Placeholder project', client: 'Client C', summary: 'Replace with a real case study in PocketBase', category: ['design'], year: 2025 },
];

export const placeholderStats = [
  { label: 'Placeholder stat', value: 10, prefix: '', suffix: '+' },
  { label: 'Placeholder stat', value: 20, prefix: '', suffix: '%' },
];

export const placeholderTestimonials = [
  { quote: 'Placeholder testimonial. Add real client quotes in PocketBase (testimonials).', name: 'Client name', role: 'Role', company: 'Company' },
];
