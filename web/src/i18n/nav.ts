import { localizePath, type Locale } from './config';
import { ui } from './ui';

export function getNav(locale: Locale) {
  const t = ui[locale].nav;
  return [
    { label: t.services, href: localizePath('/#offres', locale) },
    { label: t.work, href: localizePath('/work', locale) },
    { label: t.agencies, href: localizePath('/white-label', locale) },
    { label: t.blog, href: localizePath('/blog', locale) },
    { label: t.contact, href: localizePath('/contact', locale) },
  ];
}
