import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { SiteLayout } from "./components/site/SiteLayout";
import { Experience } from "./pages/experience/Experience";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { AdminApp } from "./pages/admin/AdminApp";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Experience />} />
        <Route element={<SiteLayout />}>
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </>
  );
}
