import {
  Color,
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';
import vertexShader from './shaders/blob.vert.glsl';
import fragmentShader from './shaders/blob.frag.glsl';
import { disposeScene } from './dispose';

interface Options {
  reduce: boolean;
}

/**
 * Noise-displaced blob for the hero.
 * - DPR capped at 2 (fill-rate), lowered automatically if frames are slow
 * - renders only while visible and the tab is active
 * - everything is disposed on cleanup (GPU memory is not garbage-collected)
 */
export function createHeroBlob(canvas: HTMLCanvasElement, { reduce }: Options): () => void {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  let dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 6;

  const uniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uMouse: { value: new Vector2() },
    uIntensity: { value: 0 },
    uColorA: { value: new Color() },
    uColorB: { value: new Color() },
    uAccent: { value: new Color() },
  };

  // Colours follow the site theme (CSS tokens), and update when the visitor switches light/dark.
  const applyTheme = () => {
    const css = getComputedStyle(document.documentElement);
    const light = document.documentElement.dataset.theme === 'light';
    uniforms.uColorA.value.set(light ? '#e9e7f8' : '#121218');
    uniforms.uColorB.value.set(light ? '#c9c5f5' : '#262438');
    uniforms.uAccent.value.set(css.getPropertyValue('--color-accent').trim() || '#4f46e5');
  };
  applyTheme();
  const onTheme = () => {
    applyTheme();
    start();
  };
  window.addEventListener('theme:change', onTheme);

  const mesh = new Mesh(
    new IcosahedronGeometry(1.15, reduce ? 24 : 64),
    new ShaderMaterial({ vertexShader, fragmentShader, uniforms }),
  );
  scene.add(mesh);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    // Keep the blob on the right, away from the headline (desktop), and lower/smaller on mobile.
    camera.position.x = w >= 1200 ? -2.3 : 0;
    camera.position.y = w >= 1200 ? 0.2 : 1.6;
    camera.updateProjectionMatrix();
  };
  resize();

  // Pointer (lerped in the loop) and scroll.
  const target = new Vector2();
  const onPointer = (e: PointerEvent) => {
    target.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  };
  const onScroll = () => {
    uniforms.uScroll.value = Math.min(window.scrollY / window.innerHeight, 1.5);
  };

  let visible = true;
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  });
  observer.observe(canvas);

  let raf = 0;
  let last = performance.now();
  let slowFrames = 0;

  const frame = (now: number) => {
    raf = 0;
    if (!visible || document.hidden) return;
    const delta = Math.min((now - last) / 1000, 0.1);
    last = now;

    // Adaptive quality: drop DPR if we keep missing 60fps.
    slowFrames = delta > 1 / 45 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
    if (slowFrames > 30 && dpr > 1) {
      dpr = Math.max(1, dpr - 0.5);
      renderer.setPixelRatio(dpr);
      resize();
      slowFrames = 0;
    }

    const speed = reduce ? 0.15 : 1;
    uniforms.uTime.value += delta * speed;
    uniforms.uMouse.value.lerp(target, reduce ? 0 : 0.05);
    uniforms.uIntensity.value += ((reduce ? 0 : target.length()) - uniforms.uIntensity.value) * 0.05;
    mesh.rotation.y += delta * 0.08 * speed;

    renderer.render(scene, camera);
    start();
  };

  function start() {
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  const onVisibility = () => !document.hidden && start();

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  start();

  return () => {
    cancelAnimationFrame(raf);
    observer.disconnect();
    window.removeEventListener('theme:change', onTheme);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibility);
    disposeScene(scene);
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
