import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Collection" },
  { to: "/about", label: "Story" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-ink/10 bg-bone/80 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <nav className="container-tight flex h-20 items-center justify-between">
        <Link to="/" className="group flex items-center gap-3" aria-label="The Linen Solutions home">
          <span className="grid h-10 w-10 place-items-center rounded-sm bg-ink font-serif text-xl leading-none text-paper">
            L
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-serif text-xl tracking-tight text-ink">The Linen Solutions</span>
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.3em] text-clay-600">
              Pure Linen · Colombo
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "link-underline text-[11px] font-medium uppercase tracking-[0.2em] transition-colors",
                  isActive ? "text-ink" : "text-ink/55 hover:text-ink"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <button
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span
            className={cn(
              "h-px w-6 bg-ink transition-all duration-300",
              open && "translate-y-[3.5px] rotate-45"
            )}
          />
          <span
            className={cn(
              "h-px w-6 bg-ink transition-all duration-300",
              open && "-translate-y-[3.5px] -rotate-45"
            )}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="overflow-hidden bg-bone md:hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="container-tight flex flex-col gap-1 border-t border-ink/10 py-6">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "block py-3 font-serif text-3xl transition-colors",
                        isActive ? "text-clay-600" : "text-ink hover:text-clay-600"
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
