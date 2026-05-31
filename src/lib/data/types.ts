export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  materials: string;
  care: string;
  featured: boolean;
  inStock: boolean;
  badge?: string; // e.g. "Bestseller", "New", "Limited"
  createdAt: number;
}

export interface Hotspot {
  id: string;
  productId: string; // links the marker to a product (its info is shown on click)
  x: number; // horizontal position, percent
  y: number; // vertical position, percent
  poetic: string; // the line shown above the product in the drawer
}

export interface ExperienceChapter {
  id: string;
  order: number;
  numeral: string; // e.g. "I"
  place: string; // e.g. "The Bedroom"
  heading: string;
  line: string;
  image: string;
  hotspots: Hotspot[];
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: number;
}

export interface SiteContent {
  brandName: string;
  tagline: string;
  currency: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  story: {
    eyebrow: string;
    title: string;
    body: string;
    image: string;
    stats: { value: string; label: string }[];
  };
  promises: { title: string; description: string; icon: string }[];
  marquee: string[];
  contact: {
    address: string;
    phone: string;
    email: string;
    hours: string;
    mapEmbed: string;
  };
  social: { instagram: string; facebook: string; pinterest: string };
}

export interface SiteData {
  content: SiteContent;
  categories: Category[];
  products: Product[];
  testimonials: Testimonial[];
  chapters: ExperienceChapter[];
}

export interface DataProvider {
  readonly mode: "firebase" | "local";
  load(): Promise<SiteData>;
  saveContent(content: SiteContent): Promise<void>;
  upsertProduct(product: Product): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  upsertCategory(category: Category): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  upsertTestimonial(testimonial: Testimonial): Promise<void>;
  deleteTestimonial(id: string): Promise<void>;
  upsertChapter(chapter: ExperienceChapter): Promise<void>;
  deleteChapter(id: string): Promise<void>;
  uploadImage(file: File): Promise<string>;
  /** Optional: populate an empty backend with starter content (Firebase only). */
  ensureSeeded?(): Promise<boolean>;
}
