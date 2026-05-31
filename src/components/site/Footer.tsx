import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram, Facebook } from "lucide-react";
import { useSiteData } from "@/lib/data/DataContext";
import { RevealText } from "@/components/motion/RevealText";

export function Footer() {
  const { data } = useSiteData();
  const c = data?.content;
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#2C2E33] text-paper">
      {/* Big call line */}
      <div className="container-tight border-b border-paper/12 py-20 md:py-28">
        <span className="eyebrow !text-clay-300 before:!bg-clay-400/60">Let's talk linen</span>
        <div className="mt-6 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <RevealText
            as="h2"
            text="Pure linen, _beautifully_ made."
            className="display max-w-3xl text-[clamp(2.5rem,7vw,6rem)] text-paper"
            stagger={0.05}
          />
          <Link
            to="/contact"
            data-cursor="Say hi"
            className="group inline-flex shrink-0 items-center gap-3 rounded-full border border-paper/25 px-7 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:border-clay-400 hover:bg-clay-500"
          >
            Get in touch
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* Columns */}
      <div className="container-tight grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-sm bg-clay-500 font-serif text-xl text-paper">
              L
            </span>
            <span className="font-serif text-xl">The Linen Solutions</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/55">
            {c?.tagline ||
              "Sustainably crafted pure-linen textiles for a softer, slower life."}
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: c?.social.instagram, label: "Instagram", Icon: Instagram },
              { href: c?.social.facebook, label: "Facebook", Icon: Facebook },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border border-paper/20 text-paper/80 transition-colors hover:border-clay-400 hover:text-clay-300"
              >
                <Icon className="h-4.5 w-4.5" />
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
            Collection
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-paper/70">
            <li><Link to="/shop" className="link-underline">All products</Link></li>
            <li><Link to="/shop?category=bedding" className="link-underline">Bedding</Link></li>
            <li><Link to="/shop?category=bath" className="link-underline">Bath</Link></li>
            <li><Link to="/shop?category=table" className="link-underline">Table</Link></li>
            <li><Link to="/shop?category=living" className="link-underline">Living</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
            Company
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-paper/70">
            <li><Link to="/about" className="link-underline">Our story</Link></li>
            <li><Link to="/about#craft" className="link-underline">Our craft</Link></li>
            <li><Link to="/contact" className="link-underline">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
            Visit
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-paper/70">
            <li>{c?.contact.address || "Colombo, Sri Lanka"}</li>
            <li>
              <a href={`tel:${c?.contact.phone || "0768093244"}`} className="link-underline">
                {c?.contact.phone || "0768093244"}
              </a>
            </li>
            <li>
              <a href={`mailto:${c?.contact.email || "hello@thelinensolutions.com"}`} className="link-underline">
                {c?.contact.email || "hello@thelinensolutions.com"}
              </a>
            </li>
            <li className="text-paper/45">{c?.contact.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/12">
        <div className="container-tight flex flex-col items-center justify-between gap-3 py-7 text-[11px] uppercase tracking-[0.15em] text-paper/45 sm:flex-row">
          <p>© {year} The Linen Solutions</p>
          <p>Handcrafted in Colombo, Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
}
