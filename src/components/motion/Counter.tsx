import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Counts up to a numeric target when scrolled into view. Preserves prefix/suffix text. */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();

  const match = value.match(/^(\D*)([\d,.]+)(.*)$/);
  const [display, setDisplay] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!inView || !match) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const prefix = match[1];
    const target = parseFloat(match[2].replace(/,/g, ""));
    const suffix = match[3];
    const hasComma = match[2].includes(",");
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = Math.round(target * eased);
      const formatted = hasComma ? current.toLocaleString("en-US") : String(current);
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, match, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
