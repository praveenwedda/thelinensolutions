import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "$"): string {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${currency}${formatted}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

/** Turn a save/write error into a clear, actionable admin message. */
export function saveErrorMessage(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/permission|insufficient|PERMISSION_DENIED/i.test(msg)) {
    return "Save blocked by Firebase. Publish your Firestore security rules (Firestore → Rules) and make sure you're signed in.";
  }
  if (/unsupported field value: undefined/i.test(msg)) {
    return "Save failed: a required field was left empty.";
  }
  return `Could not save. ${msg}`;
}
