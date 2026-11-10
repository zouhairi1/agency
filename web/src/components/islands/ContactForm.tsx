import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { pb } from '../../lib/pocketbase';
import type { Locale } from '../../i18n/config';
import type { FormDictionary } from '../../i18n/ui';
import {
  CDC_ACCEPT,
  MARKET_VALUES,
  MEETING_VALUES,
  SERVICE_VALUES,
  TIMELINE_VALUES,
  createContactSchema,
  type ContactInput,
} from '../../lib/validations/contact';

const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void; theme?: string; language?: string }) => string;
      reset: (id?: string) => void;
    };
  }
}

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Errors = Partial<Record<keyof ContactInput | 'form', string>>;

export interface ContactFormProps {
  t: FormDictionary;
  locale: Locale;
  channel?: 'form' | 'drawer' | 'estimator';
  /** Project scoper selections, attached to the lead when present. */
  estimate?: unknown;
  /** Pre-select the CDC answer (e.g. from the scoper's "I have specifications" button). */
  initialHasCdc?: boolean;
}

export default function ContactForm({ t, locale, channel = 'form', estimate, initialHasCdc }: ContactFormProps) {
  const reduce = useReducedMotion();
  const id = useId();
  const schema = useMemo(() => createContactSchema(t), [t]);
  const [values, setValues] = useState<ContactInput>({
    services: [],
    has_cdc: initialHasCdc,
    name: '',
    email: '',
    market: locale === 'fr' ? 'morocco' : undefined,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [token, setToken] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  // Cloudflare Turnstile, only when a site key is configured.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return;
    const render = () => {
      if (window.turnstile && turnstileRef.current && !widgetId.current) {
        widgetId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark',
          language: locale,
          callback: setToken,
        });
      }
    };
    if (window.turnstile) return render();
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = render;
    document.head.append(script);
  }, [locale]);

  const set = <K extends keyof ContactInput>(key: K, value: ContactInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
  };

  const toggleService = (value: (typeof SERVICE_VALUES)[number]) =>
    set('services', values.services.includes(value) ? values.services.filter((s) => s !== value) : [...values.services, value]);

  async function submit(event: { preventDefault(): void }) {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof ContactInput] ??= issue.message;
      setErrors(next);
      return;
    }
    if (TURNSTILE_SITE_KEY && !token) {
      setErrors({ form: t.spam });
      return;
    }

    setStatus('sending');
    try {
      const data = parsed.data;
      const params = new URLSearchParams(window.location.search);
      const utm = Object.fromEntries([...params].filter(([k]) => k.startsWith('utm_')));
      await pb()
        .collection('leads')
        .create(
          {
            ...data,
            has_cdc: data.has_cdc ?? false,
            attachment: data.has_cdc ? data.attachment : undefined,
            meeting_preference: data.has_cdc ? undefined : data.meeting_preference,
            country: data.market === 'international' ? data.country : 'Maroc',
            language: locale,
            channel,
            estimate: estimate ?? null,
            source_page: window.location.pathname,
            utm,
            status: 'new',
          },
          { headers: token ? { 'X-Turnstile-Token': token } : {} },
        );
      setStatus('sent');
      window.dispatchEvent(new CustomEvent('analytics', { detail: { event: 'contact_submit', channel, has_cdc: data.has_cdc } }));
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrors({ form: t.error });
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
      setToken('');
    }
  }

  const fade = {
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduce ? 0 : -16 },
    transition: { duration: reduce ? 0.2 : 0.5 },
  };
  const reveal = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
    transition: { duration: reduce ? 0.2 : 0.45, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <AnimatePresence mode="wait">
      {status === 'sent' ? (
        <motion.div key="sent" {...fade} className="py-16 text-center" role="status">
          <svg viewBox="0 0 52 52" className="mx-auto mb-6 size-16 text-accent-text" aria-hidden="true">
            <motion.circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2"
              initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
            <motion.path d="M15 27l7 7 15-15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
              initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: reduce ? 0 : 0.5 }} />
          </svg>
          <h3 className="font-display text-3xl">{t.sent}</h3>
          <p className="mt-3 text-muted">{t.sentText.replace('{name}', values.name.split(' ')[0])}</p>
        </motion.div>
      ) : (
        <motion.form key="form" {...fade} onSubmit={submit} noValidate className="space-y-9">
          <Group legend={t.services} error={errors.services}>
            {SERVICE_VALUES.map((v) => (
              <Chip key={v} active={values.services.includes(v)} onClick={() => toggleService(v)}>
                {t.serviceOptions[v]}
              </Chip>
            ))}
          </Group>

          <div>
            <Group legend={t.cdc}>
              <Chip active={values.has_cdc === true} onClick={() => set('has_cdc', true)}>{t.yes}</Chip>
              <Chip active={values.has_cdc === false} onClick={() => set('has_cdc', false)}>{t.no}</Chip>
            </Group>

            <AnimatePresence initial={false}>
              {values.has_cdc === true && (
                <motion.div key="cdc-yes" {...reveal} className="overflow-hidden">
                  <label htmlFor={`${id}-cdc`} className="mt-5 block cursor-pointer rounded-sm border border-dashed border-line p-5 transition-colors hover:border-paper/50 focus-within:border-accent">
                    <span className="block text-sm">{values.attachment?.name ?? t.cdcFile}</span>
                    <span className="mt-1 block text-xs text-muted">{t.cdcFileHint}</span>
                    <input id={`${id}-cdc`} type="file" accept={CDC_ACCEPT} className="sr-only"
                      onChange={(e) => set('attachment', e.target.files?.[0])} />
                  </label>
                  <FieldError message={errors.attachment} />
                </motion.div>
              )}
              {values.has_cdc === false && (
                <motion.div key="cdc-no" {...reveal} className="overflow-hidden">
                  <p className="mt-4 text-sm text-muted">{t.noCdcHint}</p>
                  <Group legend={t.meeting} className="mt-5">
                    {MEETING_VALUES.filter((v) => v !== 'in-person' || values.market !== 'international').map((v) => (
                      <Chip key={v} active={values.meeting_preference === v} onClick={() => set('meeting_preference', v)}>
                        {t.meetingOptions[v]}
                      </Chip>
                    ))}
                  </Group>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Group legend={t.timeline}>
            {TIMELINE_VALUES.map((v) => (
              <Chip key={v} active={values.timeline === v} onClick={() => set('timeline', v)}>
                {t.timelineOptions[v]}
              </Chip>
            ))}
          </Group>

          <div>
            <Group legend={t.market}>
              {MARKET_VALUES.map((v) => (
                <Chip key={v} active={values.market === v} onClick={() => set('market', v)}>
                  {t.marketOptions[v]}
                </Chip>
              ))}
            </Group>
            <AnimatePresence initial={false}>
              {values.market === 'international' && (
                <motion.div key="country" {...reveal} className="overflow-hidden">
                  <Input id={`${id}-country`} label={t.country} value={values.country ?? ''} autoComplete="country-name"
                    onChange={(v) => set('country', v)} className="mt-5 max-w-sm" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Input id={`${id}-name`} label={t.name} value={values.name} error={errors.name} autoComplete="name"
              onChange={(v) => set('name', v)} />
            <Input id={`${id}-email`} label={t.email} type="email" value={values.email} error={errors.email} autoComplete="email"
              onChange={(v) => set('email', v)} />
            <Input id={`${id}-phone`} label={t.phone} type="tel" value={values.phone ?? ''} autoComplete="tel"
              placeholder={t.phoneHint} onChange={(v) => set('phone', v)} />
            <Input id={`${id}-company`} label={t.company} value={values.company ?? ''} autoComplete="organization"
              onChange={(v) => set('company', v)} />
            <Input id={`${id}-message`} label={t.message} value={values.message ?? ''} multiline
              onChange={(v) => set('message', v)} className="sm:col-span-2" />
          </div>

          {TURNSTILE_SITE_KEY && <div ref={turnstileRef} />}

          {errors.form && (
            <motion.p role="alert" className="text-sm text-red-400"
              animate={reduce ? {} : { x: [0, -6, 6, -4, 4, 0] }} transition={{ duration: 0.4 }}>
              {errors.form}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={status === 'sending'}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 font-medium text-on-accent transition-opacity disabled:opacity-60"
          >
            {status === 'sending' ? t.sending : t.submit}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Group({ legend, error, className = '', children }: { legend: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <fieldset className={className}>
      <legend className="eyebrow mb-3">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      <FieldError message={error} />
    </fieldset>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      whileTap={reduce ? undefined : { scale: 0.95 }}
      className={`rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
        active ? 'border-accent bg-accent text-on-accent' : 'border-line text-paper hover:border-paper/50'
      }`}
    >
      {children}
    </motion.button>
  );
}

function Input(props: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}) {
  const { id, label, value, onChange, error, type = 'text', multiline, autoComplete, placeholder, className = '' } = props;
  const shared = {
    id,
    value,
    autoComplete,
    placeholder,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    className:
      'w-full border-b border-line bg-transparent py-3 text-lg outline-none transition-colors duration-300 placeholder:text-paper/25 focus:border-accent aria-[invalid=true]:border-red-400',
  };
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow block">
        {label}
      </label>
      {multiline ? <textarea rows={4} {...shared} /> : <input type={type} {...shared} />}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id?: string; message?: string }) {
  return message ? (
    <p id={id} className="mt-2 text-sm text-red-400">
      {message}
    </p>
  ) : null;
}
