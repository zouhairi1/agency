export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = { fr: 'Français', en: 'English' };
export const htmlLang: Record<Locale, string> = { fr: 'fr-MA', en: 'en' };
export const ogLocale: Record<Locale, string> = { fr: 'fr_MA', en: 'en_US' };

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Locale from a URL path: `/en/...` → en, anything else → default (fr). */
export function getLocale(url: URL): Locale {
  const first = url.pathname.split('/')[1];
  return isLocale(first) ? first : defaultLocale;
}

/** Path for a locale. `localizePath('/work', 'en')` → `/en/work`; default locale has no prefix. */
export function localizePath(path: string, locale: Locale): string {
  const [pathname, hash = ''] = path.split('#');
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const localized = locale === defaultLocale ? clean : `/${locale}${clean === '/' ? '/' : clean}`;
  return hash ? `${localized}#${hash}` : localized;
}

/** Same page in another locale (used by the language switcher + hreflang). */
export function switchLocalePath(url: URL, to: Locale): string {
  const parts = url.pathname.split('/');
  const withoutLocale = isLocale(parts[1]) ? '/' + parts.slice(2).join('/') : url.pathname;
  return localizePath(withoutLocale || '/', to);
}

/** Pick the localized value of a PocketBase field: `title_en` for English, falling back to the French `title`. */
export function pick<T extends Record<string, unknown>>(data: T, field: string, locale: Locale): string {
  if (locale !== defaultLocale) {
    const translated = data[`${field}_${locale}`];
    if (typeof translated === 'string' && translated.trim()) return translated;
  }
  const value = data[field];
  return typeof value === 'string' ? value : '';
}
