"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types";

export function VariantSelector({
  variants,
  selected,
  onSelect,
}: {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}) {
  if (variants.length === 0) return null;

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-foreground">Ukuran</span>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selected?.id === variant.id;
          const outOfStock = variant.stock <= 0;
          return (
            <Button
              key={variant.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              disabled={outOfStock}
              onClick={() => onSelect(variant)}
              className={cn("rounded-full", outOfStock && "line-through")}
            >
              {variant.label}
              {outOfStock ? " (habis)" : ""}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
