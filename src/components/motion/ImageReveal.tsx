import { motion, useReducedMotion } from "framer-motion";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  src: string;
  alt: string;
  fallbackLabel?: string;
  className?: string;
  imgClassName?: string;
  /** Reveal direction of the mask. */
  from?: "bottom" | "top" | "left" | "right";
  delay?: number;
}

const clips: Record<string, string> = {
  bottom: "inset(100% 0 0 0)",
  top: "inset(0 0 100% 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
};

/** Editorial image that unmasks (clip-path) while gently zooming on scroll-in. */
export function ImageReveal({
  src,
  alt,
  fallbackLabel,
  className,
  imgClassName,
  from = "bottom",
  delay = 0,
}: ImageRevealProps) {
  const reduce = useReducedMotion();

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="h-full w-full"
        initial={reduce ? { clipPath: "inset(0 0 0 0)" } : { clipPath: clips[from] }}
        whileInView={{ clipPath: "inset(0% 0 0 0)" }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay }}
      >
        <motion.div
          className="h-full w-full"
          initial={reduce ? { scale: 1 } : { scale: 1.25 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay }}
        >
          <ImageWithFallback
            src={src}
            alt={alt}
            fallbackLabel={fallbackLabel}
            className={cn("h-full w-full object-cover", imgClassName)}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
