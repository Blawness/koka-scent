"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types";
import { CATEGORY_LABELS } from "@/components/storefront/product-card";

export type CategoryOption = ProductCategory | "all";

export const OPTIONS: CategoryOption[] = ["all", "unisex", "wanita", "pria", "diffuser"];

export function CategoryFilter({
  value,
  onChange,
}: {
  value: CategoryOption;
  onChange: (value: CategoryOption) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => (
        <Button
          key={option}
          type="button"
          size="sm"
          variant={value === option ? "default" : "outline"}
          className={cn("rounded-full", value === option && "shadow-sm")}
          onClick={() => onChange(option)}
        >
          {option === "all" ? "Semua" : CATEGORY_LABELS[option]}
        </Button>
      ))}
    </div>
  );
}
