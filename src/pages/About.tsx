import { Link } from "react-router-dom";
import { Leaf, Hand, Recycle, Sparkles } from "lucide-react";
import { useSiteData } from "@/lib/data/DataContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Reveal } from "@/components/Reveal";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Leaf,
    title: "Grown, not made",
    body: "It begins in the flax fields of Western Europe - a crop that needs little water and no irrigation, leaving the land better than it found it.",
  },
  {
    icon: Hand,
    title: "Spun & woven",
    body: "Long flax fibres are spun into yarn and woven into cloth on traditional looms, preserving the natural slubs that give linen its character.",
  },
  {
    icon: Sparkles,
    title: "Stonewashed by hand",
    body: "Every piece is garment-washed to relax the weave, giving our linen its signature pre-softened, lived-in feel from the very first use.",
  },
  {
    icon: Recycle,
    title: "Finished to last",
    body: "Hemmed, inspected and hand-finished in Colombo, then wrapped in plastic-free packaging and sent to your door.",
  },
];

export function About() {
  const { data } = useSiteData();
  if (!data) return null;
  const { story } = data.content;

  return (
    <>
      <Seo
        title="Our Story - Pure Linen Handcrafted in Colombo | The Linen Solutions"
        description="From a small Colombo atelier to a linen house trusted by homes, hotels and villas across Sri Lanka and beyond. 100% European flax, stonewashed by hand, OEKO-TEX® certified."
        path="/about"
      />
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1600&q=80"
            alt="Natural linen fabric"
            fallbackLabel="Our Story"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linen-900/55" />
        </div>
        <div className="container-tight relative z-10 text-center">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-widest text-accent">
              Est. in Colombo
            </p>
            <h1 className="mx-auto mt-4 max-w-3xl font-serif text-5xl leading-tight text-linen-50 md:text-6xl text-balance">
              We believe the everyday deserves to be beautiful
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Intro */}
      <section className="container-tight grid items-center gap-12 py-20 md:grid-cols-2 md:py-28" id="craft">
        <Reveal>
          <p className="eyebrow">{story.eyebrow}</p>
          <h2 className="mt-3 font-serif text-4xl text-foreground md:text-5xl text-balance">
            {story.title}
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">{story.body}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            What started as a small atelier supplying boutique hotels has grown into a
            collection trusted by thousands of homes across the world - yet our promise
            has never changed: pure materials, honest craft, and textiles made to be
            loved for years, not seasons.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-linen-200 pt-8">
            {story.stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl text-foreground">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="aspect-[4/5] overflow-hidden rounded-xl">
            <ImageWithFallback
              src={story.image}
              alt="Linen weave detail"
              fallbackLabel="Our Craft"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* Process */}
      <section className="bg-linen-100/60 py-20 md:py-28">
        <div className="container-tight">
          <Reveal className="mb-14 text-center">
            <p className="eyebrow">From Field to Home</p>
            <h2 className="mt-3 font-serif text-4xl text-foreground md:text-5xl">
              How our linen is made
            </h2>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="relative h-full rounded-xl border border-linen-200 bg-card p-7">
                  <span className="absolute right-6 top-5 font-serif text-4xl text-linen-200">
                    0{i + 1}
                  </span>
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-serif text-xl text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-tight py-20 text-center md:py-28">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-serif text-4xl text-foreground md:text-5xl text-balance">
            Bring a little more softness home
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Explore the collection and discover why linen, once you've lived with it,
            is impossible to give up.
          </p>
          <Button asChild size="lg" variant="accent" className="mt-8">
            <Link to="/shop">View Our Collection</Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
