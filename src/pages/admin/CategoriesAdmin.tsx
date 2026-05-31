import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "@/lib/data/DataContext";
import type { Category } from "@/lib/data/types";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageField } from "./ImageField";
import { saveErrorMessage, slugify, uid } from "@/lib/utils";

function emptyCategory(order: number): Category {
  return { id: uid("cat"), name: "", slug: "", description: "", image: "", order };
}

export function CategoriesAdmin() {
  const { data, provider, refresh } = useSiteData();
  const [editing, setEditing] = useState<Category | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  if (!data) return null;
  const { categories, products } = data;
  const count = (id: string) => products.filter((p) => p.categoryId === id).length;

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) return toast.error("Category name is required.");
    setSaving(true);
    try {
      await provider.upsertCategory({
        ...editing,
        slug: editing.slug || slugify(editing.name),
        order: Number(editing.order) || 0,
      });
      await refresh();
      setEditing(null);
      toast.success("Category saved.");
    } catch (err) {
      toast.error(saveErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: Category) => {
    if (count(c.id) > 0) {
      toast.error("Move or delete this category's products first.");
      setConfirmDelete(null);
      return;
    }
    try {
      await provider.deleteCategory(c.id);
      await refresh();
      setConfirmDelete(null);
      toast.success("Category deleted.");
    } catch {
      toast.error("Could not delete category.");
    }
  };

  const set = (patch: Partial<Category>) => editing && setEditing({ ...editing, ...patch });

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground md:text-4xl">Categories</h1>
          <p className="mt-1 text-muted-foreground">Organise your collection into shoppable groups.</p>
        </div>
        <Button onClick={() => setEditing(emptyCategory(categories.length + 1))}>
          <Plus className="h-4 w-4" /> Add category
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-xl border border-linen-200 bg-card">
            <div className="aspect-[16/9] bg-linen-100">
              <ImageWithFallback src={c.image} alt={c.name} fallbackLabel={c.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{count(c.id)} products · /{c.slug}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(structuredClone(c))} className="rounded-md p-2 text-linen-600 transition-colors hover:bg-secondary hover:text-foreground cursor-pointer" aria-label={`Edit ${c.name}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setConfirmDelete(c)} className="rounded-md p-2 text-linen-600 transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer" aria-label={`Delete ${c.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal open onClose={() => setEditing(null)} title={editing.name ? "Edit category" : "New category"}>
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Label>Name</Label>
                <Input value={editing.name} onChange={(e) => set({ name: e.target.value })} placeholder="Bedding" />
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={editing.order} onChange={(e) => set({ order: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={3} value={editing.description} onChange={(e) => set({ description: e.target.value })} />
            </div>
            <ImageField label="Cover image" value={editing.image} onChange={(url) => set({ image: url })} />
          </div>
          <div className="mt-6 flex justify-end gap-3 border-t border-linen-200 pt-5">
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save category"}</Button>
          </div>
        </Modal>
      )}

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete category?">
        <p className="text-muted-foreground">
          Delete <span className="font-medium text-foreground">{confirmDelete?.name}</span>? This can't be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="destructive" onClick={() => confirmDelete && remove(confirmDelete)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
