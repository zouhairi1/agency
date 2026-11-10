import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { animate } from 'motion';
import type { Dictionary } from '../../i18n/ui';
import type { ScoperOption } from '../../data/site';

interface Props {
  t: Dictionary['scoper'];
  options: ScoperOption[];
}

/**
 * Project scoper: estimates DURATION and complexity only, never a price
 * (pricing is given after the CDC review or a meeting).
 * Ends with two CTAs that open the contact drawer with the selections attached.
 */
export default function ProjectScoper({ t, options }: Props) {
  const reduce = useReducedMotion();
  const types = options.filter((o) => o.group === 'project_type');
  const features = options.filter((o) => o.group === 'feature');
  const [type, setType] = useState<string>();
  const [selected, setSelected] = useState<string[]>([]);

  const estimate = useMemo(() => {
    const base = types.find((o) => o.id === type);
    if (!base) return null;
    const featureWeeks = features.filter((f) => selected.includes(f.id)).reduce((sum, f) => sum + f.base_weeks, 0);
    // Features partly run in parallel: count 70% of their time.
    const weeks = base.base_weeks + featureWeeks * 0.7;
    const min = Math.max(1, Math.round(weeks * 0.85));
    const max = Math.max(min + 1, Math.round(weeks * 1.25));
    const level = weeks <= 5 ? 0 : weeks <= 11 ? 1 : 2;
    return { min, max, level, weeks };
  }, [type, selected, types, features]);

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const payload = () => ({
    estimate: {
      project_type: types.find((o) => o.id === type)?.label,
      features: features.filter((f) => selected.includes(f.id)).map((f) => f.label),
      weeks: estimate ? `${estimate.min}-${estimate.max}` : undefined,
      complexity: estimate ? t.complexityLevels[estimate.level] : undefined,
    },
  });

  const openContact = (hasCdc: boolean) => {
    window.dispatchEvent(new CustomEvent('contact:open', { detail: { ...payload(), hasCdc } }));
    window.dispatchEvent(new CustomEvent('analytics', { detail: { event: 'estimator_send', has_cdc: hasCdc } }));
  };

  useEffect(() => {
    if (type) window.dispatchEvent(new CustomEvent('analytics', { detail: { event: 'estimator_complete', type } }));
  }, [type]);

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-7">
        <fieldset>
          <legend className="eyebrow mb-4">{t.type}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {types.map((o) => (
              <Card key={o.id} active={type === o.id} onClick={() => setType(o.id)} title={o.label} text={o.description} role="radio" />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="eyebrow mb-4">{t.features}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((o) => (
              <Card key={o.id} active={selected.includes(o.id)} onClick={() => toggle(o.id)} title={o.label} text={o.description} role="checkbox" />
            ))}
          </div>
        </fieldset>

        {/* Phones/tablets: the estimate stays visible at the bottom of the screen while picking options. */}
        {estimate && (
          <div className="sticky bottom-3 z-20 lg:hidden">
            <div className="flex items-center justify-between gap-4 rounded-full border border-line bg-ink-soft/95 py-2 pl-5 pr-2 shadow-lg backdrop-blur-md">
              <p className="text-sm">
                <span className="text-muted">{t.result} · </span>
                <span className="font-medium tabular-nums">
                  {estimate.min}–{estimate.max} {t.weeks}
                </span>
              </p>
              <button
                type="button"
                onClick={() => document.getElementById('scoper-result')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })}
                aria-label={t.result}
                className="h-10 shrink-0 rounded-full bg-accent px-4 text-sm font-medium text-on-accent"
              >
                ↓
              </button>
            </div>
          </div>
        )}
      </div>

      <aside className="lg:col-span-5" id="scoper-result">
        <div className="rounded-sm border border-line bg-ink-soft p-6 sm:p-8 lg:sticky lg:top-28" aria-live="polite">
          <p className="eyebrow">{t.result}</p>
          {estimate ? (
            <>
              <p className="mt-4 font-display text-5xl tracking-tight tabular-nums sm:text-6xl md:text-7xl">
                <Num value={estimate.min} reduce={!!reduce} />–<Num value={estimate.max} reduce={!!reduce} />
                <span className="ml-3 text-2xl text-muted">{t.weeks}</span>
              </p>

              <div className="mt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{t.complexity}</span>
                  <span>{t.complexityLevels[estimate.level]}</span>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
                  <motion.div
                    className="h-full origin-left bg-accent"
                    animate={{ scaleX: Math.min(1, estimate.weeks / 22) }}
                    transition={{ duration: reduce ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              <p className="mt-6 text-xs text-muted">{t.disclaimer}</p>

              <div className="mt-8 flex flex-col gap-3">
                <Button primary onClick={() => openContact(true)}>{t.haveCdc} →</Button>
                <Button onClick={() => openContact(false)}>{t.bookMeeting}</Button>
              </div>
            </>
          ) : (
            <p className="mt-4 text-paper/60">{t.empty}</p>
          )}
        </div>
      </aside>
    </div>
  );
}

function Card({ active, onClick, title, text, role }: { active: boolean; onClick: () => void; title: string; text: string; role: 'radio' | 'checkbox' }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      role={role}
      aria-checked={active}
      onClick={onClick}
      data-prefetch-contact
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className={`rounded-sm border p-5 text-left transition-colors duration-200 ${
        active ? 'border-accent bg-accent/10' : 'border-line hover:border-paper/40'
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-medium">{title}</span>
        <span className={`grid size-5 place-items-center rounded-full border text-[10px] ${active ? 'border-accent bg-accent text-on-accent' : 'border-line'}`} aria-hidden="true">
          {active ? '✓' : ''}
        </span>
      </span>
      <span className="mt-1 block text-sm text-muted">{text}</span>
    </motion.button>
  );
}

function Button({ primary, onClick, children }: { primary?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-6 py-3.5 font-medium transition-colors ${
        primary ? 'bg-accent text-on-accent hover:bg-accent-hover' : 'border border-line hover:border-paper'
      }`}
    >
      {children}
    </button>
  );
}

/** Number that tweens to its new value (rounded, no jitter). */
function Num({ value, reduce }: { value: number; reduce: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = String(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = String(Math.round(v))),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);
  return <span ref={ref}>{value}</span>;
}
