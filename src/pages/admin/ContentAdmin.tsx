import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "@/lib/data/DataContext";
import type { SiteContent, Testimonial } from "@/lib/data/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/site/Stars";
import { ImageField } from "./ImageField";
import { saveErrorMessage, uid } from "@/lib/utils";

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-linen-200 bg-card p-6 md:p-8">
      <h2 className="font-serif text-2xl text-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

export function ContentAdmin() {
  const { data, provider, refresh } = useSiteData();
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setDraft(structuredClone(data.content));
  }, [data]);

  if (!data || !draft) return null;

  const set = (patch: Partial<SiteContent>) => setDraft({ ...draft, ...patch });
  const setHero = (patch: Partial<SiteContent["hero"]>) => set({ hero: { ...draft.hero, ...patch } });
  const setStory = (patch: Partial<SiteContent["story"]>) => set({ story: { ...draft.story, ...patch } });
  const setContact = (patch: Partial<SiteContent["contact"]>) => set({ contact: { ...draft.contact, ...patch } });
  const setSocial = (patch: Partial<SiteContent["social"]>) => set({ social: { ...draft.social, ...patch } });

  const save = async () => {
    setSaving(true);
    try {
      await provider.saveContent(draft);
      await refresh();
      toast.success("Site content updated.");
    } catch (e) {
      toast.error(saveErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  // Testimonials
  const saveTestimonial = async (t: Testimonial) => {
    await provider.upsertTestimonial(t);
    await refresh();
    toast.success("Testimonial saved.");
  };
  const deleteTestimonial = async (id: string) => {
    await provider.deleteTestimonial(id);
    await refresh();
    toast.success("Testimonial removed.");
  };

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground md:text-4xl">Site Content</h1>
          <p className="mt-1 text-muted-foreground">Edit the words and imagery across your website.</p>
        </div>
        <Button onClick={save} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
        </Button>
      </header>

      <div className="space-y-6">
        <Section title="Brand">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Label>Brand name</Label>
              <Input value={draft.brandName} onChange={(e) => set({ brandName: e.target.value })} />
            </div>
            <div>
              <Label>Currency symbol</Label>
              <Input value={draft.currency} onChange={(e) => set({ currency: e.target.value })} placeholder="$" />
            </div>
          </div>
          <div>
            <Label>Tagline</Label>
            <Input value={draft.tagline} onChange={(e) => set({ tagline: e.target.value })} />
          </div>
        </Section>

        <Section title="Homepage hero" description="The first thing visitors see.">
          <div>
            <Label>Eyebrow</Label>
            <Input value={draft.hero.eyebrow} onChange={(e) => setHero({ eyebrow: e.target.value })} />
          </div>
          <div>
            <Label>Title</Label>
            <Textarea rows={2} value={draft.hero.title} onChange={(e) => setHero({ title: e.target.value })} />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Textarea rows={3} value={draft.hero.subtitle} onChange={(e) => setHero({ subtitle: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Primary button</Label>
              <Input value={draft.hero.ctaPrimary} onChange={(e) => setHero({ ctaPrimary: e.target.value })} />
            </div>
            <div>
              <Label>Secondary button</Label>
              <Input value={draft.hero.ctaSecondary} onChange={(e) => setHero({ ctaSecondary: e.target.value })} />
            </div>
          </div>
          <ImageField label="Hero image" value={draft.hero.image} onChange={(url) => setHero({ image: url })} />
        </Section>

        <Section title="Our story" description="Shown on the homepage and About page.">
          <div>
            <Label>Eyebrow</Label>
            <Input value={draft.story.eyebrow} onChange={(e) => setStory({ eyebrow: e.target.value })} />
          </div>
          <div>
            <Label>Title</Label>
            <Input value={draft.story.title} onChange={(e) => setStory({ title: e.target.value })} />
          </div>
          <div>
            <Label>Body</Label>
            <Textarea rows={5} value={draft.story.body} onChange={(e) => setStory({ body: e.target.value })} />
          </div>
          <ImageField label="Story image" value={draft.story.image} onChange={(url) => setStory({ image: url })} />
          <div>
            <Label>Stats</Label>
            <div className="space-y-2">
              {draft.story.stats.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={s.value} onChange={(e) => { const stats = [...draft.story.stats]; stats[i] = { ...s, value: e.target.value }; setStory({ stats }); }} placeholder="100%" className="w-32" />
                  <Input value={s.label} onChange={(e) => { const stats = [...draft.story.stats]; stats[i] = { ...s, label: e.target.value }; setStory({ stats }); }} placeholder="Pure European flax" />
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Announcement bar" description="The scrolling strip of selling points.">
          <div className="space-y-2">
            {draft.marquee.map((m, i) => (
              <div key={i} className="flex gap-2">
                <Input value={m} onChange={(e) => { const marquee = [...draft.marquee]; marquee[i] = e.target.value; set({ marquee }); }} />
                <button onClick={() => set({ marquee: draft.marquee.filter((_, idx) => idx !== i) })} className="rounded-md p-2 text-linen-500 hover:text-destructive cursor-pointer" aria-label="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button onClick={() => set({ marquee: [...draft.marquee, ""] })} className="text-sm font-medium text-linen-700 hover:underline cursor-pointer">+ Add item</button>
          </div>
        </Section>

        <Section title="Contact details" description="Used in the footer and on the contact page.">
          <div>
            <Label>Address</Label>
            <Input value={draft.contact.address} onChange={(e) => setContact({ address: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Phone</Label>
              <Input value={draft.contact.phone} onChange={(e) => setContact({ phone: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={draft.contact.email} onChange={(e) => setContact({ email: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Opening hours</Label>
            <Input value={draft.contact.hours} onChange={(e) => setContact({ hours: e.target.value })} />
          </div>
          <div>
            <Label>Map embed URL</Label>
            <Input value={draft.contact.mapEmbed} onChange={(e) => setContact({ mapEmbed: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Instagram</Label>
              <Input value={draft.social.instagram} onChange={(e) => setSocial({ instagram: e.target.value })} />
            </div>
            <div>
              <Label>Facebook</Label>
              <Input value={draft.social.facebook} onChange={(e) => setSocial({ facebook: e.target.value })} />
            </div>
            <div>
              <Label>Pinterest</Label>
              <Input value={draft.social.pinterest} onChange={(e) => setSocial({ pinterest: e.target.value })} />
            </div>
          </div>
        </Section>

        <TestimonialsEditor
          testimonials={data.testimonials}
          onSave={saveTestimonial}
          onDelete={deleteTestimonial}
        />
      </div>

      {/* Sticky save */}
      <div className="sticky bottom-4 mt-6 flex justify-end">
        <Button onClick={save} disabled={saving} size="lg" className="shadow-lg">
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save all changes"}
        </Button>
      </div>
    </div>
  );
}

function TestimonialsEditor({
  testimonials,
  onSave,
  onDelete,
}: {
  testimonials: Testimonial[];
  onSave: (t: Testimonial) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [drafts, setDrafts] = useState<Testimonial[]>(testimonials);
  useEffect(() => setDrafts(testimonials), [testimonials]);

  const update = (id: string, patch: Partial<Testimonial>) =>
    setDrafts((d) => d.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const add = () =>
    setDrafts((d) => [...d, { id: uid("t"), quote: "", author: "", location: "", rating: 5 }]);

  return (
    <Section title="Testimonials" description="Customer quotes shown on the homepage. Save each one individually.">
      <div className="space-y-4">
        {drafts.map((t) => (
          <div key={t.id} className="rounded-lg border border-linen-200 p-4">
            <Textarea rows={2} value={t.quote} onChange={(e) => update(t.id, { quote: e.target.value })} placeholder="A wonderful quote…" />
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Input value={t.author} onChange={(e) => update(t.id, { author: e.target.value })} placeholder="Author" />
              <Input value={t.location} onChange={(e) => update(t.id, { location: e.target.value })} placeholder="Location" />
              <select value={t.rating} onChange={(e) => update(t.id, { rating: Number(e.target.value) })} className="h-11 rounded-md border border-input bg-white px-3 text-sm cursor-pointer">
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
              </select>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Stars rating={t.rating} />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onSave(t)}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(t.id)} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1.5 text-sm font-medium text-linen-700 hover:underline cursor-pointer">
          <Plus className="h-4 w-4" /> Add testimonial
        </button>
      </div>
    </Section>
  );
}
