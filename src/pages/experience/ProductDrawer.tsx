import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/data/types";
import { ImageWithFallback } from "@/components/ImageWithFallback";

interface DrawerProps {
  product: Product | null;
  poeticLine?: string;
  currency: string;
  onClose: () => void;
}

/** Glides in from the right (bottom on mobile) with the inspected product. */
export function ProductDrawer({ product, poeticLine, currency, onClose }: DrawerProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hidden = isDesktop ? { x: "100%", y: 0 } : { x: 0, y: "100%" };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-x-0 bottom-0 z-[80] max-h-[88vh] overflow-y-auto rounded-t-2xl bg-[#171A21] text-paper sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[440px] sm:rounded-none"
            initial={hidden}
            animate={{ x: 0, y: 0 }}
            exit={hidden}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            role="dialog"
            aria-label={product.name}
          >
            <div className="relative">
              <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-[3/4]">
                <ImageWithFallback
                  src={product.images[0]}
                  alt={product.name}
                  fallbackLabel={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171A21] via-transparent to-transparent" />
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-[#111319]/60 text-paper backdrop-blur transition-colors hover:bg-clay-500"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-7 sm:p-8">
              {poeticLine && (
                <p className="font-serif text-lg italic leading-snug text-clay-200">
                  “{poeticLine}”
                </p>
              )}
              <h3 className="mt-4 font-serif text-3xl font-light leading-tight">
                {product.name}
              </h3>
              <p className="mt-5 text-sm leading-relaxed text-paper/65">
                {product.description}
              </p>

              <dl className="mt-6 space-y-3 border-t border-paper/12 pt-6 text-sm">
                <div className="flex justify-between gap-6">
                  <dt className="text-paper/45">Materials</dt>
                  <dd className="text-right text-paper/85">{product.materials}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-paper/45">Colours</dt>
                  <dd className="text-right text-paper/85">{product.colors.join(", ")}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-paper/45">Sizes</dt>
                  <dd className="text-right text-paper/85">{product.sizes.join(", ")}</dd>
                </div>
              </dl>

              <Link
                to={`/product/${product.slug}`}
                className="mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-sm bg-clay-500 px-7 py-4 text-[11px] font-medium uppercase tracking-[0.15em] text-paper transition-colors hover:bg-clay-600"
              >
                See all details <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
