import { useState } from "react";
import { Plus, Pencil, Trash2, Star, X } from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "@/lib/data/DataContext";
import type { Product } from "@/lib/data/types";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageField } from "./ImageField";
import { formatPrice, saveErrorMessage, slugify, uid } from "@/lib/utils";

function emptyProduct(categoryId: string): Product {
  return {
    id: uid("p"),
    name: "",
    slug: "",
    categoryId,
    price: 0,
    shortDescription: "",
    description: "",
    images: [""],
    colors: [],
    sizes: [],
    materials: "100% European flax linen",
    care: "Machine wash cold. Tumble dry low.",
    featured: false,
    inStock: true,
    createdAt: Date.now(),
  };
}

export function ProductsAdmin() {
  const { data, provider, refresh } = useSiteData();
  const [editing, setEditing] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  if (!data) return null;
  const { products, categories } = data;
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  const save = async (p: Product) => {
    if (!p.name.trim()) return toast.error("Product name is required.");
    setSaving(true);
    try {
      const clean: Product = {
        ...p,
        slug: p.slug || slugify(p.name),
        images: p.images.filter((i) => i.trim()),
        price: Number(p.price) || 0,
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
      };
      if (clean.images.length === 0) clean.images = [""];
      await provider.upsertProduct(clean);
      await refresh();
      setEditing(null);
      toast.success("Product saved.");
    } catch (e) {
      toast.error(saveErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Product) => {
    try {
      await provider.deleteProduct(p.id);
      await refresh();
      setConfirmDelete(null);
      toast.success("Product deleted.");
    } catch {
      toast.error("Could not delete product.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground md:text-4xl">Products</h1>
          <p className="mt-1 text-muted-foreground">{products.length} products in your catalogue.</p>
        </div>
        <Button onClick={() => setEditing(emptyProduct(categories[0]?.id ?? ""))}>
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </header>

      <div className="overflow-hidden rounded-xl border border-linen-200 bg-card">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 border-b border-linen-100 p-4 last:border-0"
          >
            <div className="h-16 w-14 shrink-0 overflow-hidden rounded-md bg-linen-100">
              <ImageWithFallback src={p.images[0]} alt={p.name} fallbackLabel={p.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-foreground">{p.name}</p>
                {p.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-accent text-accent" />}
              </div>
              <p className="text-sm text-muted-foreground">
                {catName(p.categoryId)} · {formatPrice(p.price, data.content.currency)}
                {!p.inStock && " · Sold out"}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setEditing(structuredClone(p))}
                className="rounded-md p-2 text-linen-600 transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
                aria-label={`Edit ${p.name}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setConfirmDelete(p)}
                className="rounded-md p-2 text-linen-600 transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                aria-label={`Delete ${p.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">No products yet. Add your first one.</p>
        )}
      </div>

      {/* Edit / create modal */}
      {editing && (
        <ProductForm
          product={editing}
          categories={categories}
          saving={saving}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={() => save(editing)}
        />
      )}

      {/* Delete confirm */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete product?"
      >
        <p className="text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">{confirmDelete?.name}</span>? This
          can't be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => confirmDelete && remove(confirmDelete)}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function ProductForm({
  product,
  categories,
  saving,
  onChange,
  onClose,
  onSave,
}: {
  product: Product;
  categories: { id: string; name: string }[];
  saving: boolean;
  onChange: (p: Product) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const set = (patch: Partial<Product>) => onChange({ ...product, ...patch });

  return (
    <Modal open onClose={onClose} title={product.name ? "Edit product" : "New product"} className="max-w-2xl">
      <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
        <div>
          <Label>Name</Label>
          <Input value={product.name} onChange={(e) => set({ name: e.target.value })} placeholder="Stonewashed Duvet Cover — Oatmeal" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Category</Label>
            <select
              value={product.categoryId}
              onChange={(e) => set({ categoryId: e.target.value })}
              className="h-11 w-full rounded-md border border-input bg-white px-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Badge (optional)</Label>
            <Input value={product.badge ?? ""} onChange={(e) => set({ badge: e.target.value })} placeholder="Bestseller / New" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Price</Label>
            <Input type="number" min={0} step="0.01" value={product.price} onChange={(e) => set({ price: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Compare-at price (optional)</Label>
            <Input type="number" min={0} step="0.01" value={product.compareAtPrice ?? ""} onChange={(e) => set({ compareAtPrice: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
        </div>

        <div>
          <Label>Short description</Label>
          <Input value={product.shortDescription} onChange={(e) => set({ shortDescription: e.target.value })} placeholder="Our signature duvet cover in warm oatmeal." />
        </div>

        <div>
          <Label>Full description</Label>
          <Textarea rows={4} value={product.description} onChange={(e) => set({ description: e.target.value })} />
        </div>

        {/* Images */}
        <div className="space-y-3">
          <Label>Images</Label>
          {product.images.map((img, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <ImageField
                  label={`Image ${i + 1}`}
                  value={img}
                  onChange={(url) => {
                    const images = [...product.images];
                    images[i] = url;
                    set({ images });
                  }}
                />
              </div>
              {product.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => set({ images: product.images.filter((_, idx) => idx !== i) })}
                  className="mt-6 rounded-md p-2 text-linen-500 hover:text-destructive cursor-pointer"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => set({ images: [...product.images, ""] })}
            className="text-sm font-medium text-linen-700 underline-offset-2 hover:underline cursor-pointer"
          >
            + Add another image
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Colours (comma separated)</Label>
            <Input value={product.colors.join(", ")} onChange={(e) => set({ colors: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="Oatmeal, Ivory, Sage" />
          </div>
          <div>
            <Label>Sizes (comma separated)</Label>
            <Input value={product.sizes.join(", ")} onChange={(e) => set({ sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="Single, Double, Queen, King" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Materials</Label>
            <Input value={product.materials} onChange={(e) => set({ materials: e.target.value })} />
          </div>
          <div>
            <Label>Care</Label>
            <Input value={product.care} onChange={(e) => set({ care: e.target.value })} />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground">
            <input type="checkbox" checked={product.featured} onChange={(e) => set({ featured: e.target.checked })} className="h-4 w-4 cursor-pointer accent-[#2C2417]" />
            Featured on homepage
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground">
            <input type="checkbox" checked={product.inStock} onChange={(e) => set({ inStock: e.target.checked })} className="h-4 w-4 cursor-pointer accent-[#2C2417]" />
            In stock
          </label>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-linen-200 pt-5">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} disabled={saving}>{saving ? "Saving…" : "Save product"}</Button>
      </div>
    </Modal>
  );
}
