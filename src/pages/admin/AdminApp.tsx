import { useEffect, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useSiteData } from "@/lib/data/DataContext";
import { Login } from "./Login";
import { AdminLayout } from "./AdminLayout";
import { Dashboard } from "./Dashboard";
import { ProductsAdmin } from "./ProductsAdmin";
import { CategoriesAdmin } from "./CategoriesAdmin";
import { ContentAdmin } from "./ContentAdmin";
import { ExperienceAdmin } from "./ExperienceAdmin";

export function AdminApp() {
  const { user, ready } = useAuth();
  const { provider, refresh } = useSiteData();
  const seeded = useRef(false);

  // On first authenticated entry, publish the starter content if the
  // (Firebase) database is still empty. No-op for local/demo mode.
  useEffect(() => {
    if (!user || seeded.current || !provider.ensureSeeded) return;
    seeded.current = true;
    provider
      .ensureSeeded()
      .then((didSeed) => {
        if (didSeed) {
          toast.success("Starter content published to your live database.");
          return refresh();
        }
      })
      .catch(() => {
        toast.error("Couldn't initialise the database - check your Firestore rules.");
      });
  }, [user, provider, refresh]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linen-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-linen-300 border-t-primary" />
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="experience" element={<ExperienceAdmin />} />
        <Route path="content" element={<ContentAdmin />} />
      </Route>
    </Routes>
  );
}
