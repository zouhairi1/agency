import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

// Register plugins exactly once for the whole app.
gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

gsap.defaults({ ease: 'expo.out', duration: 1 });

export const MQ = {
  reduce: '(prefers-reduced-motion: reduce)',
  motionOK: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 1024px)',
  finePointer: '(pointer: fine)',
} as const;

export { gsap, ScrollTrigger, SplitText, Flip };
