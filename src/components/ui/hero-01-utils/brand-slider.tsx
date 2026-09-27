import React from "react";

export interface BrandList {
  image: string;
  lightimg?: string;
  name: string;
}

interface BrandSliderProps {
  brandList: BrandList[];
}

export default function BrandSlider({ brandList }: BrandSliderProps) {
  return (
    <div className="w-full border-y border-border/40 bg-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
          Trusted by Next-Generation Web3 Protocols &amp; Custodians
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-75">
          {brandList.map((brand, i) => (
            <div
              key={i}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200"
              title={brand.name}
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="h-7 w-auto max-w-[120px] object-contain dark:invert"
                onError={(e) => {
                  // Fallback to text badge if external SVG is unavailable
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.parentElement?.querySelector(
                    ".brand-fallback"
                  ) as HTMLElement | null;
                  if (fallback) fallback.style.display = "inline-block";
                }}
              />
              <span className="brand-fallback hidden text-sm font-semibold tracking-wide text-foreground/80 px-2.5 py-1 rounded bg-muted/60">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
