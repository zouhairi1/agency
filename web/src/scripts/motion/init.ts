import { gsap, ScrollTrigger, MQ } from './gsap';
import { initLenis, getLenis } from './lenis';
import { modules } from './modules';

/**
 * Motion lifecycle for Astro View Transitions:
 *  - astro:page-load    → bind every module for the current page (inside gsap.matchMedia)
 *  - astro:before-swap  → revert everything (tweens, ScrollTriggers, listeners, WebGL)
 *  - after fonts load   → ScrollTrigger.refresh() so trigger positions are correct
 */
let mm: gsap.MatchMedia | null = null;

function init() {
  initLenis();

  mm = gsap.matchMedia();
  // gsap.matchMedia only runs the callback when at least one condition matches, so `all` must always be true.
  // (Without it, touch phones without reduced motion matched nothing and every reveal stayed hidden.)
  mm.add(
    { all: '(min-width: 0px)', reduce: MQ.reduce, desktop: MQ.desktop, finePointer: MQ.finePointer },
    (context) => {
      const { reduce = false, desktop = false, finePointer = false } = context.conditions ?? {};
      const cleanups = modules.map((run) => run({ reduce, desktop, finePointer })).filter(Boolean) as Array<() => void>;
      return () => cleanups.forEach((fn) => fn());
    },
  );

  // Recalculate trigger positions once fonts are in and layout is stable.
  document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

function destroy() {
  mm?.revert();
  mm = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', destroy);
document.addEventListener('astro:after-swap', () => {
  const lenis = getLenis();
  // Re-sync Lenis with the scroll position the router restored (top for new pages, saved for back/forward).
  lenis?.resize();
  lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
});
