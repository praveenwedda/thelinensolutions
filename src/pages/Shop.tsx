import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSiteData } from "@/lib/data/DataContext";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Seo } from "@/components/Seo";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

export function Shop() {
  const { data } = useSiteData();
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState<SortKey>("featured");

  const active = params.get("category") ?? "all";

  const products = useMemo(() => {
    if (!data) return [];
    let list = data.products;
    if (active !== "all") {
      const cat = data.categories.find((c) => c.slug === active);
      list = list.filter((p) => p.categoryId === cat?.id);
    }
    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return sorted;
  }, [data, active, sort]);

  if (!data) return null;
  const { categories, content } = data;
  const activeCat = categories.find((c) => c.slug === active);

  const setCategory = (slug: string) => {
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    setParams(params, { replace: true });
  };

  return (
    <>
      <Seo
        title={
          activeCat
            ? `${activeCat.name} Linen — The Linen Solutions, Sri Lanka`
            : "Shop Pure Linen — Bed, Bath, Table & Living Collection | Sri Lanka"
        }
        description={
          activeCat
            ? `${activeCat.description} Shop ${activeCat.name.toLowerCase()} linen from The Linen Solutions, Colombo, Sri Lanka — 100% European flax, OEKO-TEX® certified.`
            : "Browse the full pure-linen collection from The Linen Solutions, Sri Lanka — bed linen, bath linen, table linen and living textiles in 100% stonewashed European flax. For homes, hotels and villas."
        }
        path={activeCat ? `/shop?category=${activeCat.slug}` : "/shop"}
        keywords="linen Sri Lanka, bed linen, bath linen, table linen, hotel linen Colombo, pure linen bedding"
      />
      {/* Header */}
      <section className="container-tight pt-32 md:pt-36">
        <div className="flex flex-wrap items-center justify-between gap-y-2 border-t border-ink/15 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-ink/50">
          <span>The Collection</span>
          <span>{products.length} pieces</span>
        </div>
        <div className="grid gap-6 pt-8 lg:grid-cols-12 lg:items-end">
          <RevealText
            as="h1"
            text={activeCat ? activeCat.name : "All Linens"}
            className="display text-d-md text-ink lg:col-span-8"
          />
          <Reveal delay={0.2} className="lg:col-span-4">
            <p className="max-w-md text-sm leading-relaxed text-ink/60">
              {activeCat
                ? activeCat.description
                : "Every piece is woven from pure European flax and stonewashed for that signature lived-in softness."}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-tight py-12">
        {/* Filters */}
        <div className="mb-10 flex flex-col gap-4 border-b border-linen-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {[{ name: "All", slug: "all" }, ...categories].map((c) => (
              <button
                key={c.slug}
                onClick={() => setCategory(c.slug)}
                className={cn(
                  "shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition-colors cursor-pointer",
                  active === c.slug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-linen-300 text-linen-700 hover:border-primary"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-xs uppercase tracking-wider text-muted-foreground">
              Sort
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 rounded-md border border-linen-300 bg-white px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <p className="mb-8 text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>

        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-2xl text-foreground">Nothing here yet</p>
            <p className="mt-2 text-muted-foreground">
              There are no products in this category at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.05}>
                <ProductCard product={p} currency={content.currency} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
