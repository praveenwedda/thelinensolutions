import { useRef, useState } from "react";
import { Upload, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { provider } from "@/lib/data/DataContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageField({ label, value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please choose an image under 5MB.");
      return;
    }
    setBusy(true);
    try {
      const url = await provider.uploadImage(file);
      onChange(url);
      toast.success("Image uploaded.");
    } catch {
      toast.error("Upload failed. You can paste an image URL instead.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-3">
        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md border border-linen-200 bg-linen-100">
          {value ? (
            <ImageWithFallback src={value} alt="" fallbackLabel="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-linen-400">
              <LinkIcon className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="relative flex items-center">
            <LinkIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste an image URL…"
              className="pl-9"
            />
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md border border-linen-300 px-3 py-1.5 text-xs font-medium text-linen-700 transition-colors hover:bg-secondary disabled:opacity-50 cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            {busy ? "Uploading…" : "Upload image"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFile}
          />
        </div>
      </div>
    </div>
  );
}
