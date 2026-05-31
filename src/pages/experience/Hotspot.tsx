import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface HotspotProps {
  x: number; // percent
  y: number; // percent
  label: string;
  active: boolean;
  index: number;
  onClick: () => void;
}

/** A pulsing marker placed over the scene; expands to a label on hover. */
export function Hotspot({ x, y, label, active, index, onClick }: HotspotProps) {
  return (
    <motion.button
      onClick={onClick}
      data-cursor="Inspect"
      className="group pointer-events-auto absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 + index * 0.15, type: "spring", stiffness: 200, damping: 16 }}
      aria-label={`Inspect ${label}`}
    >
      {/* pulse */}
      <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay-300/30">
        <span className="absolute inset-0 animate-ping rounded-full bg-clay-200/40" />
      </span>
      {/* dot */}
      <span
        className={`relative grid h-9 w-9 place-items-center rounded-full border backdrop-blur-sm transition-all duration-300 ${
          active
            ? "border-clay-200 bg-clay-400 text-[#111319]"
            : "border-paper/60 bg-[#111319]/40 text-paper group-hover:border-clay-200 group-hover:bg-clay-400 group-hover:text-[#111319]"
        }`}
      >
        <Plus className={`h-4 w-4 transition-transform duration-300 ${active ? "rotate-45" : ""}`} />
      </span>
      {/* label */}
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111319]/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-paper opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
        {label}
      </span>
    </motion.button>
  );
}
