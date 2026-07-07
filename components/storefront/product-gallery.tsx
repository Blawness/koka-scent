"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const gallery = images.length > 0 ? images : ["/products/placeholder.svg"];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="plinth shadow-soft relative aspect-square w-full overflow-hidden rounded-3xl">
        <Image
          src={gallery[active]}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto lg:w-20 lg:flex-none lg:flex-col lg:overflow-x-visible lg:overflow-y-auto">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted transition-opacity lg:size-20 lg:w-full",
                i === active
                  ? "ring-2 ring-terracotta"
                  : "opacity-70 hover:opacity-100",
              )}
              aria-label={`Lihat gambar ${i + 1}`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
