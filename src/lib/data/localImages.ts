import type { Product, SiteData } from "./types";

const base = import.meta.env.BASE_URL;

/**
 * Per-product overrides applied on top of whatever the backend/seed returns, so
 * the shop, product page and homepage drawer all reflect these without any
 * backend editing. Images are served from our own /public folder.
 * Add or edit an entry here to change a product's images or name.
 */
const PRODUCT_OVERRIDES: Record<string, Partial<Product>> = {
  p_sheet_set_ivory: {
    name: "Core Linen Sheet Set",
    images: [`${base}bedding1.jpg`, `${base}bedding2.jpg`],
  },
  p_towel_waffle: {
    name: "Bath Towel — Natural",
    images: [`${base}towels1.jpg`, `${base}towels2.jpg`],
  },
  p_tablecloth: {
    images: [`${base}tablecloth1.jpg`, `${base}tablecloth2.jpg`],
  },
  p_duvet_oatmeal: {
    name: "Stonewashed Duvet Cover",
    images: [`${base}duvet1.jpg`, `${base}duvet2.jpg`],
  },
  p_napkins: {
    images: [`${base}napkins1.jpg`, `${base}napkins2.jpg`],
  },
  p_robe_waffle: {
    name: "Waffle Bath Robe",
    images: [`${base}robe1.jpg`, `${base}robe2.jpg`],
  },
};

/** Apply the bundled product overrides to freshly loaded site data. */
export function applyImageOverrides(data: SiteData): SiteData {
  return {
    ...data,
    products: data.products.map((p) => {
      const o = PRODUCT_OVERRIDES[p.id];
      return o ? { ...p, ...o } : p;
    }),
  };
}
