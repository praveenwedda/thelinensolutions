import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/data/types";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  /** Retained for call-site compatibility; price is no longer displayed. */
  currency?: string;
  index?: number;
}) {
  return (
    <Link to={`/product/${product.slug}`} data-cursor="View" className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-linen-100">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          fallbackLabel={product.name}
          className="h-full w-full object-cover transition-transform [transition-duration:1100ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        {product.images[1] && (
          <ImageWithFallback
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fallbackLabel={product.name}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}

        {/* meta corner */}
        <div className="absolute left-0 top-0 flex items-center gap-3 p-4">
          {typeof index === "number" && (
            <span className="font-serif text-sm italic text-paper/0 mix-blend-difference">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          {product.badge && (
            <span className="rounded-full bg-paper/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink backdrop-blur">
              {product.badge}
            </span>
          )}
        </div>

        {!product.inStock && (
          <span className="absolute right-4 top-4 rounded-full bg-ink/85 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-paper">
            Sold out
          </span>
        )}

        <div className="absolute bottom-4 right-4 grid h-11 w-11 translate-y-3 place-items-center rounded-full bg-paper text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 border-t border-ink/10 pt-3">
        <h3 className="font-serif text-lg leading-snug text-ink transition-colors group-hover:text-clay-600">
          {product.name}
        </h3>
        <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink/45">
          {product.colors.length} colours · {product.sizes.length}{" "}
          {product.sizes.length === 1 ? "size" : "sizes"}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {product.colors.slice(0, 5).map((c) => (
            <span
              key={c}
              className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[10px] tracking-wide text-ink/60"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
