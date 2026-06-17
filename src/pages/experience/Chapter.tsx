import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { MousePointerClick } from "lucide-react";
import type { Product } from "@/lib/data/types";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/Reveal";
import { Hotspot } from "./Hotspot";

export interface ChapterHotspot {
  product: Product;
  x: number;
  y: number;
  poetic: string;
}

export interface ChapterData {
  id: string;
  numeral: string;
  place: string;
  heading: string;
  line: string;
  image: string;
}

interface ChapterProps {
  chapter: ChapterData;
  hotspots: ChapterHotspot[];
  activeId: string | null;
  onSelect: (h: ChapterHotspot) => void;
}

export function Chapter({ chapter, hotspots, activeId, onSelect }: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scrollY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["-6%", "6%"]
  );

  // mouse "look around" parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - (r.left + r.width / 2)) / r.width) * -36);
    my.set(((e.clientY - (r.top + r.height / 2)) / r.height) * -24);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-screen items-end overflow-hidden bg-[#111319]"
    >
      {/* scene */}
      <motion.div className="absolute inset-0 scale-[1.12]" style={{ y: scrollY, x: sx }}>
        <motion.div className="relative h-full w-full" style={{ y: sy }}>
          <ImageWithFallback
            src={chapter.image}
            alt={chapter.heading}
            fallbackLabel={chapter.place}
            className="absolute inset-0 h-full w-full object-cover brightness-105"
          />
          {/* soft bottom scrim only — keeps the copy legible without tinting the whole photo */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111319]/80 via-[#111319]/8 to-transparent" />
          {/* gentle vignette for depth */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_64%,rgba(0,0,0,0.18))]" />
        </motion.div>
      </motion.div>

      {/* hotspot layer — shares the scene's transform so each marker stays on its object,
          but sits above the copy so text never covers a marker */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 scale-[1.12]"
        style={{ y: scrollY, x: sx }}
      >
        <motion.div className="relative h-full w-full" style={{ y: sy }}>
          {hotspots.map((h, i) => (
            <Hotspot
              key={h.product.id}
              x={h.x}
              y={h.y}
              index={i}
              label={h.product.name.split("—")[0].trim()}
              active={activeId === h.product.id}
              onClick={() => onSelect(h)}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* chapter copy */}
      <div className="container-tight relative z-10 pb-20 pt-32 md:pb-28">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 text-clay-200">
            <span className="font-serif text-lg italic">{chapter.numeral}</span>
            <span className="h-px w-12 bg-clay-300/50" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em]">
              {chapter.place}
            </span>
          </div>
          <RevealText
            as="h2"
            text={chapter.heading}
            className="mt-5 font-serif text-[clamp(2.4rem,6vw,5rem)] font-light leading-[0.98] tracking-tight text-paper"
            stagger={0.05}
          />
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-xl font-serif text-lg italic leading-relaxed text-paper/75">
              {chapter.line}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-clay-200/80">
              <MousePointerClick className="h-3.5 w-3.5" />
              Tap the markers to explore the linen
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
