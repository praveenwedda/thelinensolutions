import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Short label shown on the branded fallback (e.g. product name). */
  fallbackLabel?: string;
}

/**
 * Image that gracefully degrades to a tasteful linen-toned placeholder
 * if the source fails to load - so a broken URL never breaks the design.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackLabel,
  ...props
}: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "relative flex flex-col items-center justify-center overflow-hidden bg-linen-200",
          className
        )}
        role="img"
        aria-label={alt}
        style={{
          backgroundImage:
            // woven linen texture from layered hairline gradients
            "repeating-linear-gradient(0deg, rgba(27,23,18,0.05) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(27,23,18,0.05) 0 1px, transparent 1px 4px), linear-gradient(135deg, #EFE7D8, #E3D8C4 55%, #D3C4A8)",
        }}
      >
        <span className="grid h-11 w-11 place-items-center rounded-full border border-clay-500/40 font-serif text-xl text-clay-600">
          L
        </span>
        {fallbackLabel ? (
          <span className="mt-3 max-w-[80%] text-center font-serif text-base italic leading-tight text-linen-700">
            {fallbackLabel}
          </span>
        ) : null}
        <span className="absolute bottom-3 text-[9px] uppercase tracking-[0.25em] text-linen-600/70">
          Pure Linen
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      onLoad={() => setLoaded(true)}
      className={cn(
        "transition-opacity duration-700",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
      {...props}
    />
  );
}
