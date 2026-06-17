import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Leaf, Droplets, ShieldCheck, Plus } from "lucide-react";
import { useSiteData } from "@/lib/data/DataContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/Reveal";
import { Seo, SITE_URL } from "@/components/Seo";
import { cn } from "@/lib/utils";

export function ProductDetail() {
  const { slug } = useParams();
  const { data } = useSiteData();

  const product = useMemo(
    () => data?.products.find((p) => p.slug === slug),
    [data, slug]
  );

  const [activeImg, setActiveImg] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("details");

  if (!data) return null;

  if (!product) {
    return (
      <div className="container-tight flex min-h-[70vh] flex-col items-center justify-center pt-20 text-center">
        <p className="font-serif text-3xl text-foreground">Product not found</p>
        <p className="mt-2 text-muted-foreground">
          The piece you're looking for may have moved.
        </p>
        <Button asChild className="mt-6">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    );
  }

  const category = data.categories.find((c) => c.id === product.categoryId);
  const related = data.products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const sections = [
    { id: "details", label: "Description", body: product.description },
    { id: "materials", label: "Materials", body: product.materials },
    { id: "care", label: "Care", body: product.care },
  ];

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    category: category?.name,
    brand: { "@type": "Brand", name: "The Linen Solutions" },
    material: product.materials,
    color: product.colors.join(", "),
    url: `${SITE_URL}/product/${product.slug}`,
    countryOfOrigin: "Sri Lanka",
  };

  return (
    <article className="pt-24">
      <Seo
        title={`${product.name} - Pure Linen | The Linen Solutions, Sri Lanka`}
        description={`${product.shortDescription} Woven from ${product.materials.toLowerCase()}, available in ${product.colors.join(", ")}. From The Linen Solutions, Colombo, Sri Lanka.`}
        path={`/product/${product.slug}`}
        image={product.images[0]}
        jsonLd={productLd}
      />
      <div className="container-tight">
        <Link
          to="/shop"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            {product.images.length > 1 && (
              <div className="flex gap-3 sm:flex-col">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "h-20 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors cursor-pointer sm:h-24 sm:w-20",
                      activeImg === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                    aria-label={`View image ${i + 1}`}
                  >
                    <ImageWithFallback
                      src={src}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      fallbackLabel={product.name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-xl bg-linen-100">
              <ImageWithFallback
                key={activeImg}
                src={product.images[activeImg]}
                alt={product.name}
                fallbackLabel={product.name}
                className="h-full w-full object-cover"
              />
              {product.badge && (
                <Badge className="absolute left-4 top-4">{product.badge}</Badge>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:pt-2">
            {category && (
              <Link
                to={`/shop?category=${category.slug}`}
                className="eyebrow transition-colors hover:text-accent"
              >
                {category.name}
              </Link>
            )}
            <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </p>

            {/* Colors */}
            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-wider text-linen-700">
                Available colours
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-linen-300 px-4 py-1.5 text-sm text-linen-700"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-linen-700">
                Available sizes
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <span
                    key={s}
                    className="min-w-[3rem] rounded-md border border-linen-300 px-4 py-2 text-center text-sm text-linen-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Qualities */}
            <div className="mt-9 grid grid-cols-3 gap-3 border-y border-linen-200 py-5 text-center">
              {[
                { icon: Leaf, label: "100% European flax" },
                { icon: Droplets, label: "Stonewashed soft" },
                { icon: ShieldCheck, label: "OEKO-TEX® certified" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-2">
                  <t.icon className="h-5 w-5 text-accent" />
                  <span className="text-[11px] leading-tight text-muted-foreground">{t.label}</span>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="mt-6 divide-y divide-linen-200 border-t border-linen-200">
              {sections.map((s) => (
                <div key={s.id}>
                  <button
                    onClick={() => setOpenSection(openSection === s.id ? null : s.id)}
                    className="flex w-full items-center justify-between py-4 text-left cursor-pointer"
                  >
                    <span className="font-medium text-foreground">{s.label}</span>
                    <Plus
                      className={cn(
                        "h-4 w-4 text-linen-600 transition-transform",
                        openSection === s.id && "rotate-45"
                      )}
                    />
                  </button>
                  {openSection === s.id && (
                    <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <Reveal className="mb-10 text-center">
              <p className="eyebrow">You may also like</p>
              <h2 className="mt-3 font-serif text-3xl text-foreground md:text-4xl">
                Complete the look
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} currency={data.content.currency} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
