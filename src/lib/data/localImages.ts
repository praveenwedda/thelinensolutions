import type { SiteData } from "./types";

const base = import.meta.env.BASE_URL;

/**
 * Product images served from our own /public folder, keyed by product id.
 * These override whatever the backend/seed has, so the shop, product page and
 * homepage drawer all show our bundled photos without any backend editing.
 * Add an entry here to swap a product's images.
 */
const PRODUCT_IMAGES: Record<string, string[]> = {
  p_sheet_set_ivory: [`${base}bedding1.jpg`, `${base}bedding2.jpg`],
};

/** Apply the bundled image overrides to freshly loaded site data. */
export function applyImageOverrides(data: SiteData): SiteData {
  return {
    ...data,
    products: data.products.map((p) =>
      PRODUCT_IMAGES[p.id] ? { ...p, images: PRODUCT_IMAGES[p.id] } : p
    ),
  };
}
