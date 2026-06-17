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
    name: "Bath Towel - Natural",
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
  p_pillowcases_sage: {
    images: [`${base}pillow2.jpg`, `${base}pillows1.jpg`],
  },
};

/**
 * Homepage scene images, keyed by chapter id. Mirrored into the data so the
 * admin's Experience editor shows the same images the public site renders.
 */
const CHAPTER_IMAGES: Record<string, string> = {
  ch_bed: `${base}bedroom.jpg`,
  ch_bath: `${base}bathroom.jpeg`,
  ch_table: `${base}table.jpg`,
};

/** Apply the bundled overrides to freshly loaded site data. */
export function applyImageOverrides(data: SiteData): SiteData {
  const merged: SiteData = {
    ...data,
    content: {
      ...data.content,
      // "From the flax field to your home" story image (rotated linen weave).
      story: { ...data.content.story, image: `${base}Linenweave.jpg` },
    },
    products: data.products.map((p) => {
      const o = PRODUCT_OVERRIDES[p.id];
      return o ? { ...p, ...o } : p;
    }),
    chapters: data.chapters.map((c) =>
      CHAPTER_IMAGES[c.id] ? { ...c, image: CHAPTER_IMAGES[c.id] } : c
    ),
  };
  // Replace any em-dashes (—) with hyphens across all text coming from the
  // backend (product names, descriptions, content, etc.) so the live site
  // never shows em-dashes regardless of what's stored in Firestore.
  return JSON.parse(JSON.stringify(merged).replace(/—/g, "-")) as SiteData;
}
