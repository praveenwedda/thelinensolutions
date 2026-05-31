import { Link } from "react-router-dom";
import { Package, FolderTree, Star, FileText, ArrowRight, Database } from "lucide-react";
import { useSiteData } from "@/lib/data/DataContext";
import { provider } from "@/lib/data/DataContext";

export function Dashboard() {
  const { data } = useSiteData();
  if (!data) return null;

  const stats = [
    { label: "Products", value: data.products.length, icon: Package, to: "/admin/products" },
    { label: "Categories", value: data.categories.length, icon: FolderTree, to: "/admin/categories" },
    { label: "Featured", value: data.products.filter((p) => p.featured).length, icon: Star, to: "/admin/products" },
    { label: "Testimonials", value: data.testimonials.length, icon: FileText, to: "/admin/content" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-foreground md:text-4xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back. Here's a snapshot of your store.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="group rounded-xl border border-linen-200 bg-card p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-linen-700">
                <s.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-linen-300 transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
            </div>
            <p className="mt-4 font-serif text-4xl text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-linen-200 bg-card p-6">
          <h2 className="font-serif text-xl text-foreground">Quick actions</h2>
          <div className="mt-4 space-y-2">
            {[
              { to: "/admin/products", label: "Add or edit a product", icon: Package },
              { to: "/admin/categories", label: "Manage categories", icon: FolderTree },
              { to: "/admin/content", label: "Edit homepage & contact details", icon: FileText },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="flex items-center gap-3 rounded-md border border-linen-200 px-4 py-3 text-sm font-medium text-linen-700 transition-colors hover:bg-secondary"
              >
                <a.icon className="h-4.5 w-4.5" />
                {a.label}
                <ArrowRight className="ml-auto h-4 w-4 text-linen-300" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-linen-200 bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-linen-700">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-foreground">Data source</h2>
              <p className="text-sm text-muted-foreground">
                {provider.mode === "local" ? "Demo mode" : "Live · Firebase"}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {provider.mode === "local"
              ? "You're in demo mode. Changes are saved to this browser only — perfect for previewing. Add your Firebase keys to .env to publish live, shared content."
              : "Connected to Firebase. Every change you save here is published live to your website instantly."}
          </p>
        </div>
      </div>
    </div>
  );
}
