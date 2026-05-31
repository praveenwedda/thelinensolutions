import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom agency-style cursor: a small clay dot with a trailing ring that
 * expands over interactive elements. Only on fine-pointer devices.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 300, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 300, damping: 28, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement;
      const interactive = el.closest(
        'a, button, [role="button"], input, select, textarea, label, [data-cursor]'
      ) as HTMLElement | null;
      setHovering(!!interactive);
      setLabel(interactive?.getAttribute("data-cursor") || null);
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", dn);
      window.removeEventListener("mouseup", up);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      {/* Trailing ring */}
      <motion.div
        className="absolute left-0 top-0 grid place-items-center rounded-full border border-ink/40"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: label ? 92 : hovering ? 56 : 34,
          height: label ? 92 : hovering ? 56 : 34,
          backgroundColor: hovering ? "rgba(180,98,59,0.12)" : "rgba(180,98,59,0)",
          borderColor: hovering ? "rgba(180,98,59,0.5)" : "rgba(27,23,18,0.35)",
          scale: down ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 22 }}
      >
        {label && (
          <span className="text-[10px] font-medium uppercase tracking-widest text-clay-700">
            {label}
          </span>
        )}
      </motion.div>
      {/* Center dot */}
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-clay-600"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: label ? 0 : 1 }}
      />
    </div>
  );
}
