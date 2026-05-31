import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/** Buttery smooth scrolling (desktop). Disabled for reduced-motion users. */
export function SmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    lenisInstance = lenis;
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Jump to top instantly on route change.
  useEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
