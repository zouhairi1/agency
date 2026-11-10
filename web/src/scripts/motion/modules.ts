import { gsap, ScrollTrigger, SplitText, MQ } from './gsap';

/** Each module binds to elements via data attributes and may return a cleanup function. */
export type MotionModule = (ctx: { reduce: boolean; desktop: boolean; finePointer: boolean }) => void | (() => void);

const $$ = <T extends Element = HTMLElement>(selector: string) => Array.from(document.querySelectorAll<T>(selector));

/** [data-reveal="lines" | "words" | "fade"] — text and block reveals on scroll. */
export const reveal: MotionModule = ({ reduce }) => {
  for (const el of $$('[data-reveal]')) {
    const type = el.dataset.reveal;
    const delay = Number(el.dataset.revealDelay ?? 0);
    const immediate = el.hasAttribute('data-reveal-immediate');
    gsap.set(el, { visibility: 'visible' });

    if (reduce) {
      gsap.from(el, { opacity: 0, duration: 0.2, ease: 'none', delay: immediate ? delay : 0 });
      continue;
    }

    const scrollTrigger = immediate ? undefined : { trigger: el, start: 'top 88%', once: true };

    if (type === 'lines' || type === 'words') {
      SplitText.create(el, {
        type: type === 'lines' ? 'lines' : 'words,lines',
        mask: 'lines',
        linesClass: 'split-line',
        aria: 'auto',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(type === 'lines' ? self.lines : self.words, {
            yPercent: 110,
            duration: 1.1,
            stagger: type === 'lines' ? 0.08 : 0.03,
            delay,
            scrollTrigger,
          }),
      });
    } else {
      gsap.from(el, { y: 32, opacity: 0, duration: 1, delay, scrollTrigger });
    }
  }
};

/** [data-scrub-words] — words light up from 15% to 100% opacity as you scroll (manifesto). */
export const scrubWords: MotionModule = ({ reduce }) => {
  if (reduce) return;
  for (const el of $$('[data-scrub-words]')) {
    SplitText.create(el, {
      type: 'words',
      aria: 'auto',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
          },
        ),
    });
  }
};

/** [data-media-reveal] — clip-path opens and media scales in on enter. */
export const mediaReveal: MotionModule = ({ reduce }) => {
  for (const el of $$('[data-media-reveal]')) {
    gsap.set(el, { visibility: 'visible' });
    if (reduce) continue;
    const media = el.querySelector('img, video, [data-media]');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    tl.from(el, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' });
    if (media) tl.from(media, { scale: 1.25, duration: 1.6, ease: 'expo.out' }, '<');
  }
};

/** [data-parallax="10"] — vertical parallax in yPercent. */
export const parallax: MotionModule = ({ reduce }) => {
  if (reduce) return;
  for (const el of $$('[data-parallax]')) {
    const amount = Number(el.dataset.parallax || 10);
    gsap.fromTo(
      el,
      { yPercent: -amount },
      { yPercent: amount, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, scrub: true } },
    );
  }
};

/** [data-counter] with data-value — counts up once on enter. */
export const counter: MotionModule = ({ reduce }) => {
  for (const el of $$('[data-counter]')) {
    const value = Number(el.dataset.value ?? el.textContent ?? 0);
    if (reduce) {
      el.textContent = String(value);
      continue;
    }
    const state = { n: 0 };
    gsap.to(state, {
      n: value,
      duration: 2,
      ease: 'power2.out',
      snap: { n: 1 },
      onUpdate: () => (el.textContent = String(state.n)),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  }
};

/** [data-marquee] — infinite marquee whose speed/direction follows scroll velocity. */
export const marquee: MotionModule = ({ reduce }) => {
  const cleanups: Array<() => void> = [];
  for (const el of $$('[data-marquee]')) {
    const track = el.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) continue;
    if (!track.dataset.cloned) {
      const clone = track.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      track.after(clone);
      track.dataset.cloned = 'true';
    }
    if (reduce) continue;

    const tracks = el.querySelectorAll<HTMLElement>('[data-marquee-track]');
    const speed = Number(el.dataset.marquee || 40);
    const tween = gsap.to(tracks, { xPercent: -100, ease: 'none', duration: speed, repeat: -1 });

    const st = ScrollTrigger.create({
      trigger: el,
      onUpdate: (self) => {
        const v = self.getVelocity() / 300;
        const direction = self.direction === 1 ? 1 : -1;
        gsap.to(tween, { timeScale: direction * gsap.utils.clamp(1, 6, Math.abs(v)), duration: 0.3, overwrite: true });
        gsap.to(tween, { timeScale: direction, duration: 1.2, delay: 0.3, overwrite: false });
      },
    });

    const pause = () => tween.pause();
    const play = () => tween.play();
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', play);
    cleanups.push(() => {
      st.kill();
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', play);
    });
  }
  return () => cleanups.forEach((fn) => fn());
};

/** [data-horizontal] containing [data-horizontal-track] — pinned horizontal scroll (desktop only). */
export const horizontal: MotionModule = ({ reduce, desktop }) => {
  if (reduce || !desktop) return;
  for (const section of $$('[data-horizontal]')) {
    const track = section.querySelector<HTMLElement>('[data-horizontal-track]');
    if (!track) continue;
    const distance = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
  }
};

/** [data-magnetic] — element follows the pointer slightly (fine pointers only). */
export const magnetic: MotionModule = ({ reduce, finePointer }) => {
  if (reduce || !finePointer) return;
  const cleanups: Array<() => void> = [];
  for (const el of $$('[data-magnetic]')) {
    const strength = Number(el.dataset.magnetic || 0.35);
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    });
  }
  return () => cleanups.forEach((fn) => fn());
};

/** [data-hover-preview] list; rows with [data-preview-src] show a floating image that follows the cursor. */
export const hoverPreview: MotionModule = ({ reduce, finePointer }) => {
  if (!finePointer) return;
  const cleanups: Array<() => void> = [];
  for (const list of $$('[data-hover-preview]')) {
    const frame = document.createElement('div');
    frame.className =
      'pointer-events-none fixed left-0 top-0 z-40 aspect-[4/3] w-[22rem] overflow-hidden rounded-sm opacity-0 bg-ink-soft';
    frame.style.transform = 'translate(-50%, -50%) scale(0.8)';
    const img = document.createElement('img');
    img.alt = '';
    img.className = 'h-full w-full object-cover';
    frame.append(img);
    document.body.append(frame);

    const xTo = gsap.quickTo(frame, 'x', { duration: reduce ? 0 : 0.7, ease: 'power3.out' });
    const yTo = gsap.quickTo(frame, 'y', { duration: reduce ? 0 : 0.7, ease: 'power3.out' });
    let lastX = 0;

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!reduce) gsap.to(frame, { rotation: gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4), duration: 0.5 });
      lastX = e.clientX;
    };
    const enter = (e: Event) => {
      const row = (e.target as Element).closest<HTMLElement>('[data-preview-src]');
      if (!row?.dataset.previewSrc) return;
      img.src = row.dataset.previewSrc;
      gsap.to(frame, { opacity: 1, scale: 1, duration: reduce ? 0.2 : 0.5 });
    };
    const leave = () => gsap.to(frame, { opacity: 0, scale: 0.8, duration: 0.3 });

    list.addEventListener('pointermove', move);
    list.addEventListener('pointerover', enter);
    list.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      list.removeEventListener('pointermove', move);
      list.removeEventListener('pointerover', enter);
      list.removeEventListener('pointerleave', leave);
      frame.remove();
    });
  }
  return () => cleanups.forEach((fn) => fn());
};

/** [data-hero-canvas] — lazy-loads the WebGL hero after first paint, if the device can handle it. */
export const heroCanvas: MotionModule = ({ reduce }) => {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  // Desktop/tablet only: on phones the static gradient is cleaner and faster.
  if (!canvas || window.innerWidth < 768 || !canCanvas()) return;

  let dispose: (() => void) | undefined;
  let cancelled = false;
  const start = () =>
    import('../webgl/heroBlob').then(({ createHeroBlob }) => {
      if (cancelled) return;
      dispose = createHeroBlob(canvas, { reduce });
      gsap.to(canvas, { opacity: 0.7, duration: 1.5, ease: 'power2.out' });
    });

  const hasIdle = typeof window.requestIdleCallback === 'function';
  const handle = hasIdle ? window.requestIdleCallback(start) : globalThis.setTimeout(start, 200);

  return () => {
    cancelled = true;
    if (hasIdle) window.cancelIdleCallback(handle as number);
    else globalThis.clearTimeout(handle);
    dispose?.();
  };
};

function canCanvas(): boolean {
  try {
    const test = document.createElement('canvas');
    const gl = test.getContext('webgl2') || test.getContext('webgl');
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 2;
    // @ts-expect-error -- deviceMemory is not in all TS lib versions
    const lowMemory = (navigator.deviceMemory ?? 8) < 2;
    return Boolean(gl) && !lowPower && !lowMemory;
  } catch {
    return false;
  }
}

export const modules: MotionModule[] = [
  reveal,
  scrubWords,
  mediaReveal,
  parallax,
  counter,
  marquee,
  magnetic,
  heroCanvas,
];

export { MQ };
