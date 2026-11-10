import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Locale } from '../../i18n/config';
import type { Dictionary } from '../../i18n/ui';

// The form (PocketBase SDK + Zod) is only downloaded when the drawer opens, or when the visitor hovers a contact CTA.
const loadForm = () => import('./ContactForm');
const ContactForm = lazy(loadForm);

interface Props {
  locale: Locale;
  t: Pick<Dictionary, 'drawer' | 'form' | 'contact'>;
  email: string;
  whatsapp?: string;
  bookingUrl?: string;
}

interface OpenDetail {
  estimate?: unknown;
  hasCdc?: boolean;
}

/**
 * Global slide-out contact drawer.
 * Opened by [data-open-contact] clicks, the `contact:open` event (from the project scoper) or the #contact hash.
 * Persists across page navigations.
 */
export default function ContactDrawer({ locale, t, email, whatsapp, bookingUrl }: Props) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<OpenDetail>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    if (window.location.hash === '#contact') history.replaceState(null, '', window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as Element | null)?.closest<HTMLElement>('[data-open-contact]');
      if (!trigger) return;
      e.preventDefault();
      returnFocus.current = trigger;
      setDetail({});
      setOpen(true);
      window.dispatchEvent(new CustomEvent('analytics', { detail: { event: 'contact_drawer_open', source: trigger.dataset.openContact || 'cta' } }));
    };
    const onOpen = (e: Event) => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setDetail((e as CustomEvent<OpenDetail>).detail ?? {});
      setOpen(true);
    };
    const onHash = () => window.location.hash === '#contact' && setOpen(true);
    const prefetch = (e: Event) => (e.target as Element | null)?.closest?.('[data-open-contact], [data-prefetch-contact]') && loadForm();

    document.addEventListener('pointerover', prefetch, { passive: true });
    document.addEventListener('focusin', prefetch);
    document.addEventListener('click', onClick);
    window.addEventListener('contact:open', onOpen);
    window.addEventListener('hashchange', onHash);
    onHash();
    return () => {
      document.removeEventListener('pointerover', prefetch);
      document.removeEventListener('focusin', prefetch);
      document.removeEventListener('click', onClick);
      window.removeEventListener('contact:open', onOpen);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  // Scroll lock, Esc to close, focus management + focus trap.
  useEffect(() => {
    if (!open) {
      returnFocus.current?.focus();
      return;
    }
    window.dispatchEvent(new Event('scroll:lock'));
    document.documentElement.style.overflow = 'hidden';
    const timer = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('button, input')?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      window.dispatchEvent(new Event('scroll:unlock'));
    };
  }, [open, close]);

  const waText = locale === 'fr' ? 'Bonjour ! J’aimerais parler d’un projet.' : "Hi! I'd like to talk about a project.";
  const waHref = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(waText)}` : undefined;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-labelledby="contact-drawer-title">
          <motion.div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          />
          <motion.div
            ref={panelRef}
            className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col overflow-y-auto bg-ink-soft px-6 py-8 sm:px-12"
            data-lenis-prevent
            initial={reduce ? { opacity: 0 } : { x: '100%' }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: reduce ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-8 flex items-start justify-between gap-6">
              <div>
                <p className="eyebrow">{t.drawer.label}</p>
                <h2 id="contact-drawer-title" className="mt-2 font-display text-4xl leading-none sm:text-5xl">
                  {t.drawer.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="grid size-12 shrink-0 place-items-center rounded-full border border-line transition-colors hover:border-paper"
                aria-label={t.drawer.close}
              >
                ✕
              </button>
            </div>

            <p className="mb-8 border-l-2 border-accent pl-4 text-sm text-paper/70">{t.contact.pricingNote}</p>

            <Suspense fallback={<p className="py-16 text-muted" role="status">{t.drawer.loading}</p>}>
              <ContactForm
                key={JSON.stringify(detail)}
                t={t.form}
                locale={locale}
                channel={detail.estimate ? 'estimator' : 'drawer'}
                estimate={detail.estimate}
                initialHasCdc={detail.hasCdc}
              />
            </Suspense>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 text-sm text-muted">
              <a className="hover:text-paper" href={`mailto:${email}`}>{email}</a>
              {waHref && (
                <a className="hover:text-paper" href={waHref} target="_blank" rel="noopener"
                  onClick={() => window.dispatchEvent(new CustomEvent('analytics', { detail: { event: 'whatsapp_click', location: 'drawer' } }))}>
                  {t.contact.whatsapp}
                </a>
              )}
              {bookingUrl && (
                <a className="hover:text-paper" href={bookingUrl} target="_blank" rel="noopener">
                  {t.contact.book}
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
