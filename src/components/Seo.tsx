import { useEffect } from "react";

export const SITE_URL = "https://thelinensolutions.com";
export const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80";

interface SeoProps {
  title: string;
  description: string;
  /** Route path, e.g. "/shop". Used for canonical + og:url. */
  path: string;
  image?: string;
  keywords?: string;
  noindex?: boolean;
  /** Page-specific structured data (Product, FAQPage, Breadcrumb…). */
  jsonLd?: object | object[];
}

function meta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function link(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Per-route SEO: sets title, meta description/keywords, robots, canonical,
 * Open Graph + Twitter tags, and an optional page-specific JSON-LD block.
 * Rendered (and re-run) on each page so JS-rendering crawlers (Googlebot,
 * Bingbot, AI crawlers) read accurate, page-specific metadata.
 */
export function Seo({ title, description, path, image, keywords, noindex, jsonLd }: SeoProps) {
  const dep = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const img = image || DEFAULT_OG_IMAGE;

    document.title = title;
    meta("name", "description", description);
    meta("name", "robots", noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large");
    if (keywords) meta("name", "keywords", keywords);
    link("canonical", url);

    meta("property", "og:title", title);
    meta("property", "og:description", description);
    meta("property", "og:url", url);
    meta("property", "og:image", img);
    meta("property", "og:type", "website");
    meta("property", "og:site_name", "The Linen Solutions");
    meta("name", "twitter:card", "summary_large_image");
    meta("name", "twitter:title", title);
    meta("name", "twitter:description", description);
    meta("name", "twitter:image", img);

    const id = "route-jsonld";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.id = id;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, path, image, keywords, noindex, dep]);

  return null;
}
