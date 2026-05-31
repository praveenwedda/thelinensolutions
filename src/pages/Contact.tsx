import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "@/lib/data/DataContext";
import { Reveal } from "@/components/Reveal";
import { RevealText } from "@/components/motion/RevealText";
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

  return (
    <>
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
    </>
  );
}
