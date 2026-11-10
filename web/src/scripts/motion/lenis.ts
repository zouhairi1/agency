import Lenis from 'lenis';
import { gsap, ScrollTrigger, MQ } from './gsap';

let lenis: Lenis | null = null;

/**
 * Single smooth-scroll instance for the whole session (survives View Transitions).
 * Driven by GSAP's ticker — one frame loop only (autoRaf: false).
 * Not created when the user prefers reduced motion: native scroll is used instead.
 */
export function initLenis(): Lenis | null {
  if (lenis || matchMedia(MQ.reduce).matches) return lenis;

  lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Islands (e.g. the contact drawer) lock/unlock scrolling through window events.
  window.addEventListener('scroll:lock', () => lenis?.stop());
  window.addEventListener('scroll:unlock', () => lenis?.start());

  // Anchor links scroll smoothly through Lenis.
  document.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || link.hasAttribute('data-open-contact')) return;
    const target = link.hash.length > 1 ? document.querySelector(link.hash) : null;
    if (!target) return;
    event.preventDefault();
    lenis?.scrollTo(target as HTMLElement, { offset: -80 });
  });

  return lenis;
}

export const getLenis = () => lenis;
