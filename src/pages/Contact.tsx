import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "@/lib/data/DataContext";
import { Reveal } from "@/components/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Seo } from "@/components/Seo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function Contact() {
  const { data } = useSiteData();
  const [sending, setSending] = useState(false);

  if (!data) return null;
  const c = data.content.contact;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Demo: no backend email yet — acknowledge gracefully.
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Thank you — we'll be in touch within one business day.");
    }, 700);
  };

  const details = [
    { icon: MapPin, label: "Visit us", value: c.address },
    { icon: Phone, label: "Call us", value: c.phone, href: `tel:${c.phone}` },
    { icon: Mail, label: "Email us", value: c.email, href: `mailto:${c.email}` },
    { icon: Clock, label: "Opening hours", value: c.hours },
  ];

  const faqs = [
    {
      q: "Where can I buy quality pure linen in Sri Lanka?",
      a: `The Linen Solutions is a pure-linen house based in Colombo, Sri Lanka. You can browse the full collection online and order directly, or visit our studio at ${c.address}. We deliver across Sri Lanka and ship worldwide.`,
    },
    {
      q: "Do you supply linen to hotels, villas and guesthouses?",
      a: "Yes. We supply bed linen, bath linen and table linen in bulk to boutique hotels, villas and guesthouses across Sri Lanka, with custom sizes and quantities available. Contact us for trade and wholesale pricing.",
    },
    {
      q: "What linen products do you offer?",
      a: "Bed linen (duvet covers, sheet sets, pillowcases), bath linen (waffle towels, bathrobes, bath mats), table linen (tablecloths, napkins, runners) and living textiles (sheer curtains, throws, cushion covers).",
    },
    {
      q: "Is your linen 100% pure linen?",
      a: "Yes — our pieces are woven from 100% European flax and stonewashed for softness. Our textiles are OEKO-TEX® certified, so they are free from harmful substances and safe for sensitive skin.",
    },
    {
      q: "Do you deliver across Sri Lanka and internationally?",
      a: "Yes. We deliver throughout Sri Lanka and offer carbon-considered worldwide shipping, wrapped in plastic-free packaging.",
    },
    {
      q: "How do I place an order?",
      a: `Call or WhatsApp us on ${c.phone}, email ${c.email}, or visit our Colombo studio. We'll help you choose sizes and colours and arrange delivery.`,
    },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Seo
        title="Contact — Buy Linen in Sri Lanka | The Linen Solutions, Colombo"
        description="Order pure linen or enquire about hotel & villa supply. The Linen Solutions, Colombo, Sri Lanka — call/WhatsApp 0768093244. Delivery across Sri Lanka & worldwide."
        path="/contact"
        keywords="buy linen Sri Lanka, linen shop Colombo, hotel linen supplier Sri Lanka, order linen online Sri Lanka"
        jsonLd={faqLd}
      />
      <section className="container-tight pt-32 md:pt-36">
        <div className="flex flex-wrap items-center justify-between gap-y-2 border-t border-ink/15 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-ink/50">
          <span>Contact</span>
          <span>Colombo · Sri Lanka</span>
        </div>
        <div className="grid gap-6 pt-8 lg:grid-cols-12 lg:items-end">
          <RevealText
            as="h1"
            text="Get in _touch_"
            className="display text-d-md text-ink lg:col-span-8"
          />
          <Reveal delay={0.2} className="lg:col-span-4">
            <p className="max-w-md text-sm leading-relaxed text-ink/60">
              Questions about an order, a custom size, or wholesale enquiries — our
              Colombo studio is here to help.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-tight grid gap-12 py-16 lg:grid-cols-2 lg:gap-20">
        {/* Details + map */}
        <Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label} className="rounded-xl border border-linen-200 bg-card p-6">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-linen-700">
                  <d.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {d.label}
                </p>
                {d.href ? (
                  <a href={d.href} className="mt-1 block font-medium text-foreground transition-colors hover:text-accent">
                    {d.value}
                  </a>
                ) : (
                  <p className="mt-1 font-medium text-foreground">{d.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-linen-200">
            <iframe
              title="The Linen Solutions location"
              src={c.mapEmbed}
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-linen-200 bg-card p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-foreground">Send us a message</h2>
            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="How can we help?" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required rows={5} placeholder="Tell us a little more…" />
              </div>
              <Button type="submit" size="lg" variant="accent" disabled={sending} className="w-full">
                {sending ? "Sending…" : (<>Send message <Send className="h-4 w-4" /></>)}
              </Button>
            </form>
          </div>
        </Reveal>
      </div>

      {/* FAQ — answers the questions buyers search for (AEO/GEO) */}
      <section className="border-t border-linen-200 bg-linen-100/40">
        <div className="container-tight py-16 md:py-24">
          <Reveal className="mb-10 text-center">
            <p className="eyebrow justify-center">Good to know</p>
            <h2 className="mt-3 font-serif text-4xl text-foreground md:text-5xl">
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="mx-auto max-w-3xl divide-y divide-linen-200 border-y border-linen-200">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg text-foreground marker:content-['']">
                  {f.q}
                  <span className="shrink-0 text-clay-600 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
