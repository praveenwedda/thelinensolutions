import type {
  Category,
  DataProvider,
  ExperienceChapter,
  Product,
  SiteContent,
  SiteData,
  Testimonial,
} from "./types";
import { SEED } from "./seed";

const STORAGE_KEY = "tls:data:v1";

function read(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as SiteData;
      // Backfill keys added in later versions (e.g. the experience chapters).
      if (!data.chapters) {
        data.chapters = structuredClone(SEED.chapters);
        write(data);
      }
      return data;
    }
  } catch {
    /* ignore corrupt storage */
  }
  // Seed on first run so the site is full of content immediately.
  const seeded = structuredClone(SEED);
  write(seeded);
  return seeded;
}

function write(data: SiteData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Browser-backed provider. Used automatically when Firebase is not configured.
 * Edits persist in localStorage on this device - ideal for local demos.
 */
export class LocalProvider implements DataProvider {
  readonly mode = "local" as const;

  async load(): Promise<SiteData> {
    return read();
  }

  async saveContent(content: SiteContent): Promise<void> {
    const data = read();
    data.content = content;
    write(data);
  }

  async upsertProduct(product: Product): Promise<void> {
    const data = read();
    const i = data.products.findIndex((p) => p.id === product.id);
    if (i >= 0) data.products[i] = product;
    else data.products.unshift(product);
    write(data);
  }

  async deleteProduct(id: string): Promise<void> {
    const data = read();
    data.products = data.products.filter((p) => p.id !== id);
    write(data);
  }

  async upsertCategory(category: Category): Promise<void> {
    const data = read();
    const i = data.categories.findIndex((c) => c.id === category.id);
    if (i >= 0) data.categories[i] = category;
    else data.categories.push(category);
    data.categories.sort((a, b) => a.order - b.order);
    write(data);
  }

  async deleteCategory(id: string): Promise<void> {
    const data = read();
    data.categories = data.categories.filter((c) => c.id !== id);
    write(data);
  }

  async upsertTestimonial(t: Testimonial): Promise<void> {
    const data = read();
    const i = data.testimonials.findIndex((x) => x.id === t.id);
    if (i >= 0) data.testimonials[i] = t;
    else data.testimonials.push(t);
    write(data);
  }

  async deleteTestimonial(id: string): Promise<void> {
    const data = read();
    data.testimonials = data.testimonials.filter((t) => t.id !== id);
    write(data);
  }

  async upsertChapter(chapter: ExperienceChapter): Promise<void> {
    const data = read();
    const i = data.chapters.findIndex((c) => c.id === chapter.id);
    if (i >= 0) data.chapters[i] = chapter;
    else data.chapters.push(chapter);
    data.chapters.sort((a, b) => a.order - b.order);
    write(data);
  }

  async deleteChapter(id: string): Promise<void> {
    const data = read();
    data.chapters = data.chapters.filter((c) => c.id !== id);
    write(data);
  }

  /** No object storage locally - embed the image as a data URL. */
  async uploadImage(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

/** Reset the local store back to the seed content. */
export function resetLocalData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
