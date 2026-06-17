import { useRef, useState } from "react";
import { Plus, Trash2, MapPin, Save, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "@/lib/data/DataContext";
import type { ExperienceChapter, Hotspot, Product } from "@/lib/data/types";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageField } from "./ImageField";
import { saveErrorMessage, uid } from "@/lib/utils";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n * 10) / 10));

function emptyChapter(order: number): ExperienceChapter {
  return {
    id: uid("ch"),
    order,
    numeral: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][order - 1] || String(order),
    place: "New Scene",
    heading: "A new chapter",
    line: "Describe the moment in this room…",
    image: "",
    hotspots: [],
  };
}

export function ExperienceAdmin() {
  const { data, provider, refresh } = useSiteData();
  const [confirmDelete, setConfirmDelete] = useState<ExperienceChapter | null>(null);

  if (!data) return null;
  const chapters = [...data.chapters].sort((a, b) => a.order - b.order);

  const addChapter = async () => {
    try {
      await provider.upsertChapter(emptyChapter(chapters.length + 1));
      await refresh();
      toast.success("Scene added - scroll down to edit it.");
    } catch (e) {
      toast.error(saveErrorMessage(e));
    }
  };

  const remove = async (ch: ExperienceChapter) => {
    try {
      await provider.deleteChapter(ch.id);
      await refresh();
      setConfirmDelete(null);
      toast.success("Scene removed.");
    } catch (e) {
      toast.error(saveErrorMessage(e));
    }
  };

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground md:text-4xl">The Experience</h1>
          <p className="mt-1 max-w-xl text-muted-foreground">
            Your homepage film. Each scene has an image and clickable markers - click on
            the image to drop a marker, drag to position it, then choose which product it
            reveals.
          </p>
        </div>
        <Button onClick={addChapter}>
          <Plus className="h-4 w-4" /> Add scene
        </Button>
      </header>

      <div className="space-y-6">
        {chapters.map((ch, i) => (
          <ChapterCard
            key={ch.id}
            chapter={ch}
            products={data.products}
            isFirst={i === 0}
            isLast={i === chapters.length - 1}
            onDelete={() => setConfirmDelete(ch)}
          />
        ))}
      </div>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete scene?">
        <p className="text-muted-foreground">
          Delete <span className="font-medium text-foreground">{confirmDelete?.place}</span> and
          its markers? This can't be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="destructive" onClick={() => confirmDelete && remove(confirmDelete)}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function ChapterCard({
  chapter,
  products,
  isFirst,
  isLast,
  onDelete,
}: {
  chapter: ExperienceChapter;
  products: Product[];
  isFirst: boolean;
  isLast: boolean;
  onDelete: () => void;
}) {
  const { provider, refresh } = useSiteData();
  const [draft, setDraft] = useState<ExperienceChapter>(structuredClone(chapter));
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragId = useRef<string | null>(null);

  const set = (patch: Partial<ExperienceChapter>) => setDraft((d) => ({ ...d, ...patch }));
  const setHotspots = (hotspots: Hotspot[]) => set({ hotspots });
  const productName = (id: string) =>
    products.find((p) => p.id === id)?.name.split("-")[0].trim() ?? "Unassigned";

  const posFromEvent = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return {
      x: clamp(((e.clientX - r.left) / r.width) * 100),
      y: clamp(((e.clientY - r.top) / r.height) * 100),
    };
  };

  const onCanvasPointerDown = (e: React.PointerEvent) => {
    // Empty-area press → add a marker here.
    const { x, y } = posFromEvent(e);
    const h: Hotspot = {
      id: uid("h"),
      productId: products[0]?.id ?? "",
      x,
      y,
      poetic: "",
    };
    setHotspots([...draft.hotspots, h]);
    setSelected(h.id);
  };

  const startDrag = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    dragId.current = id;
    setSelected(id);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };
  const onCanvasPointerMove = (e: React.PointerEvent) => {
    if (!dragId.current) return;
    const { x, y } = posFromEvent(e);
    setHotspots(draft.hotspots.map((h) => (h.id === dragId.current ? { ...h, x, y } : h)));
  };
  const endDrag = () => {
    dragId.current = null;
  };

  const updateHotspot = (id: string, patch: Partial<Hotspot>) =>
    setHotspots(draft.hotspots.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  const removeHotspot = (id: string) =>
    setHotspots(draft.hotspots.filter((h) => h.id !== id));

  const move = (dir: -1 | 1) => set({ order: draft.order + dir * 1.5 }); // nudged; re-normalised on save

  const save = async () => {
    setSaving(true);
    try {
      await provider.upsertChapter({ ...draft, order: Math.round(draft.order) });
      await refresh();
      toast.success(`“${draft.place}” saved.`);
    } catch (e) {
      toast.error(saveErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-xl border border-linen-200 bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-linen-200 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-primary font-serif text-sm text-primary-foreground">
            {draft.numeral}
          </span>
          <span className="font-serif text-lg text-foreground">{draft.place}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => move(-1)}
            disabled={isFirst}
            className="rounded-md p-2 text-linen-600 transition-colors hover:bg-secondary disabled:opacity-30 cursor-pointer"
            aria-label="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => move(1)}
            disabled={isLast}
            className="rounded-md p-2 text-linen-600 transition-colors hover:bg-secondary disabled:opacity-30 cursor-pointer"
            aria-label="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="rounded-md p-2 text-linen-600 transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
            aria-label="Delete scene"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* text fields */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <Label>Numeral</Label>
            <Input value={draft.numeral} onChange={(e) => set({ numeral: e.target.value })} />
          </div>
          <div className="sm:col-span-3">
            <Label>Place (chapter name)</Label>
            <Input value={draft.place} onChange={(e) => set({ place: e.target.value })} placeholder="The Bedroom" />
          </div>
        </div>
        <div>
          <Label>Heading</Label>
          <Input value={draft.heading} onChange={(e) => set({ heading: e.target.value })} />
        </div>
        <div>
          <Label>Line (poetic intro)</Label>
          <Textarea rows={2} value={draft.line} onChange={(e) => set({ line: e.target.value })} />
        </div>

        <ImageField
          label="Scene image (paste a URL, or a path like /images/bed.jpg)"
          value={draft.image}
          onChange={(url) => set({ image: url })}
        />

        {/* marker canvas */}
        <div>
          <Label>Markers - click the image to add, drag to position</Label>
          <div
            ref={canvasRef}
            onPointerDown={onCanvasPointerDown}
            onPointerMove={onCanvasPointerMove}
            onPointerUp={endDrag}
            className="relative aspect-[16/10] w-full cursor-crosshair select-none overflow-hidden rounded-md border border-linen-200 bg-linen-100"
          >
            {draft.image ? (
              <ImageWithFallback
                src={draft.image}
                alt={draft.place}
                fallbackLabel={draft.place}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">
                Add a scene image above to start placing markers
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-black/15" />
            {draft.hotspots.map((h, idx) => (
              <button
                key={h.id}
                onPointerDown={(e) => startDrag(e, h.id)}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                className={`absolute z-10 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-grab place-items-center rounded-full border text-[11px] font-semibold shadow active:cursor-grabbing ${
                  selected === h.id
                    ? "border-paper bg-accent text-accent-foreground"
                    : "border-paper bg-ink/70 text-paper"
                }`}
                aria-label={`Marker ${idx + 1}: ${productName(h.productId)}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {draft.hotspots.length} marker{draft.hotspots.length === 1 ? "" : "s"} · positions
            are stored as percentages, so they hold on any screen size.
          </p>
        </div>

        {/* marker details */}
        {draft.hotspots.length > 0 && (
          <div className="space-y-3">
            {draft.hotspots.map((h, idx) => (
              <div
                key={h.id}
                onMouseEnter={() => setSelected(h.id)}
                className={`rounded-lg border p-3 transition-colors ${
                  selected === h.id ? "border-accent bg-secondary/60" : "border-linen-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-semibold text-paper">
                    {idx + 1}
                  </span>
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <div>
                      <Label>Reveals product</Label>
                      <select
                        value={h.productId}
                        onChange={(e) => updateHotspot(h.id, { productId: e.target.value })}
                        className="h-10 w-full rounded-md border border-input bg-white px-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                      >
                        <option value="">- choose -</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Caption line</Label>
                      <Input
                        value={h.poetic}
                        onChange={(e) => updateHotspot(h.id, { poetic: e.target.value })}
                        placeholder="A short poetic line…"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeHotspot(h.id)}
                    className="mt-5 shrink-0 rounded-md p-2 text-linen-500 transition-colors hover:text-destructive cursor-pointer"
                    aria-label="Remove marker"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-4 pl-10 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {Math.round(h.x)}%, {Math.round(h.y)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end border-t border-linen-200 pt-4">
          <Button onClick={save} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save scene"}
          </Button>
        </div>
      </div>
    </section>
  );
}
