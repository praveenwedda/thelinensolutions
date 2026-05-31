import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  reverse?: boolean;
  className?: string;
  separator?: string;
}

/** Infinite horizontal marquee. Duplicated track for a seamless loop. */
export function Marquee({ items, reverse, className, separator = "—" }: MarqueeProps) {
  const track = [...items, ...items];
  return (
    <div className={cn("group flex overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max shrink-0 items-center [animation-play-state:running] group-hover:[animation-play-state:paused]",
          reverse ? "animate-marquee-rev" : "animate-marquee"
        )}
      >
        {track.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            {item}
            <span className="mx-8 text-clay-500/70 md:mx-12">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
