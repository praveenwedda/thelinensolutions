import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileText,
  Clapperboard,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { provider } from "@/lib/data/DataContext";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
  { to: "/admin/categories", label: "Categories", icon: FolderTree, end: false },
  { to: "/admin/experience", label: "Experience", icon: Clapperboard, end: false },
  { to: "/admin/content", label: "Site Content", icon: FileText, end: false },
];

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linen-100/60">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-linen-200 bg-card p-4 lg:hidden">
        <span className="font-serif text-lg text-foreground">Admin</span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 cursor-pointer"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-linen-200 bg-card transition-transform lg:static lg:flex lg:translate-x-0",
            open ? "flex translate-x-0" : "hidden -translate-x-full lg:flex"
          )}
        >
          <div className="border-b border-linen-200 p-6">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-primary font-serif text-lg text-primary-foreground">
                L
              </span>
              <div className="leading-tight">
                <p className="font-serif text-base text-foreground">The Linen Solutions</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Content Studio
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-linen-700 hover:bg-secondary"
                  )
                }
              >
                <n.icon className="h-4.5 w-4.5" />
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-2 border-t border-linen-200 p-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-linen-700 transition-colors hover:bg-secondary"
            >
              <ExternalLink className="h-4.5 w-4.5" /> View website
            </a>
            <div className="rounded-md bg-secondary px-3 py-2 text-xs text-muted-foreground">
              Signed in as
              <p className="truncate font-medium text-foreground">{user}</p>
              <p className="mt-0.5 capitalize">
                {provider.mode === "local" ? "Demo mode (this browser)" : "Live · Firebase"}
              </p>
            </div>
            <button
              onClick={() => void signOut()}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" /> Sign out
            </button>
          </div>
        </aside>

        {open && (
          <div
            className="fixed inset-0 z-20 bg-linen-900/30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Content */}
        <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
