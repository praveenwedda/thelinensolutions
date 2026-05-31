import { motion, useReducedMotion } from "framer-motion";
import { createElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  delay?: number;
  /** Stagger amount between words. */
  stagger?: number;
  once?: boolean;
}

/**
 * Editorial headline reveal — each word rises from a clipped baseline,
 * staggered. Wrap a word in underscores (_word_) to render it italic + clay.
 */
export function RevealText({
  text,
  as = "h2",
  className,
  delay = 0,
  stagger = 0.05,
  once = true,
}: RevealTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay },
    },
  };
  const word = {
    hidden: { y: "115%" },
    show: { y: "0%", transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const inner: ReactNode = (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10%" }}
      className="inline"
    >
      {words.map((w, i) => {
        const italic = w.startsWith("_") && w.endsWith("_");
        const clean = italic ? w.slice(1, -1) : w;
        return (
          <span
            key={i}
            className="mr-[0.26em] inline-flex overflow-hidden pb-[0.14em] align-baseline"
          >
            <motion.span
              variants={word}
              className={cn("inline-block", italic && "italic text-clay-600")}
            >
              {clean}
            </motion.span>
          </span>
        );
      })}
    </motion.span>
  );

  return createElement(as, { className }, inner);
}
