import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useSiteData } from "@/lib/data/DataContext";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import { Grain } from "@/components/motion/Grain";

export function SiteLayout() {
  const { loading, error } = useSiteData();

  return (
    <div className="relative flex min-h-screen flex-col">
      <SmoothScroll />
      <Cursor />
      <Grain />
      <Navbar />
      <main className="flex-1">
        {error ? (
          <div className="container-tight flex min-h-[70vh] flex-col items-center justify-center text-center">
            <p className="font-serif text-3xl text-foreground">Something went wrong</p>
            <p className="mt-2 max-w-md text-muted-foreground">{error}</p>
          </div>
        ) : loading ? (
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border border-ink/20 border-t-clay-500" />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  );
}
