import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground",
        className
      )}
      {...props}
    />
  );
}
