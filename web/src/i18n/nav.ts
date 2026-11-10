import { localizePath, type Locale } from './config';
import { ui } from './ui';

export function getNav(locale: Locale) {
  const t = ui[locale].nav;
  return [
    { label: t.work, href: localizePath('/work', locale) },
    { label: t.services, href: localizePath('/#services', locale) },
    { label: t.blog, href: localizePath('/blog', locale) },
    { label: t.contact, href: localizePath('/contact', locale) },
  ];
}
