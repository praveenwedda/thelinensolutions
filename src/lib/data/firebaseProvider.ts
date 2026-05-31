import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
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

// Refs are computed lazily so this module is safe to import even when Firebase
// is not configured (db === null) — they're only ever called in Firebase mode.
const settingsDoc = () => doc(db!, "site", "content");
const productsCol = () => collection(db!, "products");
const categoriesCol = () => collection(db!, "categories");
const testimonialsCol = () => collection(db!, "testimonials");
const chaptersCol = () => collection(db!, "chapters");

/**
 * Firestore provider. Used automatically when Firebase env vars are present.
 * Seeds the database on first run if it is empty. Image uploads use Firebase
 * Storage when available; otherwise the admin pastes static image URLs.
 */
export class FirebaseProvider implements DataProvider {
  readonly mode = "firebase" as const;

  async load(): Promise<SiteData> {
    // Read-only: never writes (anonymous visitors can't write under the
    // recommended security rules). Empty collections fall back to the seed
    // in-memory so the public site always has content to show. The database
    // is populated once by an authenticated admin via ensureSeeded().
    let contentSnap, prodSnap, catSnap, tSnap, chSnap;
    try {
      [contentSnap, prodSnap, catSnap, tSnap, chSnap] = await Promise.all([
        getDoc(settingsDoc()),
        getDocs(productsCol()),
        getDocs(categoriesCol()),
        getDocs(testimonialsCol()),
        getDocs(chaptersCol()),
      ]);
    } catch (e) {
      // Reads blocked (e.g. security rules not published yet) — show seed
      // content so the public site never breaks. Admin writes will prompt
      // for the correct rules.
      console.warn("Firestore read failed; showing seed content.", e);
      return structuredClone(SEED);
    }

    const products = prodSnap.docs.map((d) => d.data() as Product);
    const categories = catSnap.docs.map((d) => d.data() as Category);
    const testimonials = tSnap.docs.map((d) => d.data() as Testimonial);
    const chapters = chSnap.docs.map((d) => d.data() as ExperienceChapter);

    return {
      content: contentSnap.exists()
        ? (contentSnap.data() as SiteContent)
        : SEED.content,
      products: products.length
        ? products.sort((a, b) => b.createdAt - a.createdAt)
        : structuredClone(SEED.products),
      categories: categories.length
        ? categories.sort((a, b) => a.order - b.order)
        : structuredClone(SEED.categories),
      testimonials: testimonials.length ? testimonials : structuredClone(SEED.testimonials),
      chapters: chapters.length
        ? chapters.sort((a, b) => a.order - b.order)
        : structuredClone(SEED.chapters),
    };
  }

  /**
   * Populate an empty database with the starter content. Safe to call on every
   * admin login — it only writes when the database is actually empty, and runs
   * authenticated so it satisfies the "write if signed-in" security rule.
   */
  async ensureSeeded(): Promise<boolean> {
    const [contentSnap, prodSnap] = await Promise.all([
      getDoc(settingsDoc()),
      getDocs(productsCol()),
    ]);
    if (contentSnap.exists() || !prodSnap.empty) return false;

    await setDoc(settingsDoc(), SEED.content);
    await Promise.all([
      ...SEED.products.map((p) => setDoc(doc(productsCol(), p.id), p)),
      ...SEED.categories.map((c) => setDoc(doc(categoriesCol(), c.id), c)),
      ...SEED.testimonials.map((t) => setDoc(doc(testimonialsCol(), t.id), t)),
      ...SEED.chapters.map((c) => setDoc(doc(chaptersCol(), c.id), c)),
    ]);
    return true;
  }

  async saveContent(content: SiteContent): Promise<void> {
    await setDoc(settingsDoc(), content);
  }

  async upsertProduct(product: Product): Promise<void> {
    await setDoc(doc(productsCol(), product.id), product);
  }

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(productsCol(), id));
  }

  async upsertCategory(category: Category): Promise<void> {
    await setDoc(doc(categoriesCol(), category.id), category);
  }

  async deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(categoriesCol(), id));
  }

  async upsertTestimonial(t: Testimonial): Promise<void> {
    await setDoc(doc(testimonialsCol(), t.id), t);
  }

  async deleteTestimonial(id: string): Promise<void> {
    await deleteDoc(doc(testimonialsCol(), id));
  }

  async upsertChapter(chapter: ExperienceChapter): Promise<void> {
    await setDoc(doc(chaptersCol(), chapter.id), chapter);
  }

  async deleteChapter(id: string): Promise<void> {
    await deleteDoc(doc(chaptersCol(), id));
  }

  async uploadImage(file: File): Promise<string> {
    // Firebase Storage is optional (it isn't on the free Spark essentials path
    // for everyone). If it isn't configured, guide the admin to use a URL.
    if (!storage) {
      throw new Error(
        "Image uploads need Firebase Storage. Paste an image URL instead."
      );
    }
    const path = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
}
