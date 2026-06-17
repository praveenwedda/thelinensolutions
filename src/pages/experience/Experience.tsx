import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useSiteData } from "@/lib/data/DataContext";
import { SmoothScroll, getLenis } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import { Grain } from "@/components/motion/Grain";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/Reveal";
import { Seo } from "@/components/Seo";
import { Door } from "./Door";
import { Chapter, type ChapterHotspot } from "./Chapter";
import { ProductDrawer } from "./ProductDrawer";

// The opening scene (revealed behind the doors) and the individual room scenes
// use our own bundled photos rather than remote/backend images. Markers are
// re-positioned per photo so each one sits on the right object.
const HERO_IMAGE = `${import.meta.env.BASE_URL}heroimage.jpg`;

// Scenes hidden from the homepage film.
const HIDDEN_CHAPTERS = new Set(["ch_living"]);

// Per-scene bundled image overrides.
const SCENE_IMAGES: Record<string, string> = {
  ch_bed: `${import.meta.env.BASE_URL}bedroom.jpg`,
  ch_bath: `${import.meta.env.BASE_URL}bathroom.jpeg`,
  ch_table: `${import.meta.env.BASE_URL}table.jpg`,
};

// Per-scene marker positions (x/y as % of the scene), keyed by product id.
const SCENE_HOTSPOTS: Record<string, Record<string, { x: number; y: number }>> = {
  ch_bed: {
    p_curtains: { x: 9, y: 38 },
    p_pillowcases_sage: { x: 69, y: 34 },
    p_duvet_oatmeal: { x: 52, y: 55 },
    p_sheet_set_ivory: { x: 56, y: 75 },
  },
  ch_bath: {
    p_towel_waffle: { x: 36, y: 58 },
    p_robe_waffle: { x: 67, y: 60 },
    p_bathmat: { x: 47, y: 78 },
  },
  ch_table: {
    p_napkins: { x: 37, y: 44 },
    p_tablecloth: { x: 60, y: 72 },
    p_runner: { x: 80, y: 50 },
  },
};

export function Experience() {
  const { data, loading } = useSiteData();
  const [selected, setSelected] = useState<ChapterHotspot | null>(null);
  const [active, setActive] = useState("");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // Chapters come straight from the backend; each marker resolves to its product.
  const chapters = useMemo(() => {
    if (!data) return [];
    const byId = (id: string) => data.products.find((p) => p.id === id);
    return [...data.chapters]
      .filter((c) => !HIDDEN_CHAPTERS.has(c.id))
      .sort((a, b) => a.order - b.order)
      .map((c) => {
        const spots = SCENE_HOTSPOTS[c.id];
        return {
          id: c.id,
          numeral: c.numeral,
          place: c.place,
          heading: c.heading,
          line: c.line,
          image: SCENE_IMAGES[c.id] ?? c.image ?? data.content.hero.image,
          hotspots: c.hotspots
            .map((h) => {
              const product = byId(h.productId);
              if (!product) return null;
              const pos = spots?.[h.productId];
              return { product, x: pos?.x ?? h.x, y: pos?.y ?? h.y, poetic: h.poetic };
            })
            .filter(Boolean) as ChapterHotspot[],
        };
      });
  }, [data]);

  const roomImage = HERO_IMAGE;

  // highlight the chapter in view
  useEffect(() => {
    if (!chapters.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id.replace(/^ch-/, ""));
        });
      },
      { threshold: 0.5 }
    );
    chapters.forEach((c) => {
      const el = document.getElementById(`ch-${c.id}`);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [chapters]);

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111319]">
        <div className="h-8 w-8 animate-spin rounded-full border border-paper/20 border-t-clay-400" />
      </div>
    );
  }

  const jumpTo = (id: string) => {
    const el = document.getElementById(`ch-${id}`);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative bg-[#111319] text-paper">
      <Seo
        title="The Linen Solutions | Luxury Pure Linen for Homes & Hotels in Sri Lanka"
        description="Step inside a room dressed entirely in pure linen. The Linen Solutions crafts 100% European-flax bed, bath, table & living linen in Colombo, Sri Lanka - for homes, hotels and villas. Shipped nationwide & worldwide."
        path="/"
      />
      <SmoothScroll />
      <Cursor />
      <Grain />

      {/* scroll progress */}
      <motion.div
        className="fixed left-0 top-0 z-[62] h-[2px] w-full origin-left bg-clay-400"
        style={{ scaleX: progress }}
      />

      {/* top scrim keeps the header legible over the pale door */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[48] h-44 bg-gradient-to-b from-[#111319]/55 to-transparent" />

      {/* minimal header */}
      <header className="fixed inset-x-0 top-0 z-[55] flex items-center justify-between px-6 py-5 md:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-sm bg-clay-500 font-serif text-lg text-paper">
            L
          </span>
          <span className="hidden font-serif text-lg tracking-tight text-paper sm:block">
            The Linen Solutions
          </span>
        </Link>
        <Link
          to="/shop"
          className="link-underline text-[11px] font-medium uppercase tracking-[0.2em] text-paper/75 hover:text-paper"
        >
          Skip to collection →
        </Link>
      </header>

      {/* chapter index */}
      <nav className="fixed right-6 top-1/2 z-[55] hidden -translate-y-1/2 flex-col gap-4 md:flex">
        {chapters.map((c) => (
          <button
            key={c.id}
            onClick={() => jumpTo(c.id)}
            className="group flex items-center justify-end gap-3"
            aria-label={`Go to ${c.place}`}
          >
            <span
              className={`text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 ${
                active === c.id ? "text-clay-200 opacity-100" : "text-paper/60 opacity-0 group-hover:opacity-100"
              }`}
            >
              {c.place}
            </span>
            <span
              className={`h-px transition-all duration-300 ${
                active === c.id ? "w-8 bg-clay-300" : "w-4 bg-paper/40 group-hover:w-6"
              }`}
            />
          </button>
        ))}
      </nav>

      {/* THE FILM */}
      <Door roomImage={roomImage} />

      {chapters.map((c) => (
        <div key={c.id} id={`ch-${c.id}`}>
          <Chapter
            chapter={c}
            hotspots={c.hotspots}
            activeId={selected?.product.id ?? null}
            onSelect={setSelected}
          />
        </div>
      ))}

      {/* FINALE */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111319] px-6 text-center">
        <div className="relative z-10 mx-auto max-w-3xl py-32">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-clay-300">
            The film ends, the room remains
          </p>
          <RevealText
            as="h2"
            text="Take the room _home_"
            className="mt-6 font-serif text-[clamp(2.8rem,9vw,7.5rem)] font-light leading-[0.92] tracking-tight text-paper"
            stagger={0.06}
          />
          <Reveal delay={0.3}>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-paper/65">
              Every piece you've just walked through is woven from pure European flax
              and made, by hand, in Colombo. Bring it into your own four walls.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-clay-500 px-9 py-4 text-[11px] font-medium uppercase tracking-[0.15em] text-paper transition-colors hover:bg-clay-600"
              >
                View Our Collection <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="link-underline text-[11px] font-medium uppercase tracking-[0.2em] text-paper/70 hover:text-paper"
              >
                Our story
              </Link>
            </div>
          </Reveal>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-paper/12 pt-8 text-[10px] uppercase tracking-[0.2em] text-paper/40">
            <span>Bedding</span><span>·</span><span>Bath</span><span>·</span>
            <span>Table</span><span>·</span><span>Living</span>
          </div>
        </div>
      </section>

      <ProductDrawer
        product={selected?.product ?? null}
        poeticLine={selected?.poetic}
        currency={data.content.currency}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
