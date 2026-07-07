import { cn } from "@/lib/utils";

/**
 * Editorial section heading — oversized Playfair display numeral beside a serif
 * title, with an optional uppercase eyebrow. Shared across storefront screens.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end gap-4", className)}>
      {index && (
        <span className="display-number text-5xl text-terracotta sm:text-6xl">
          {index}
        </span>
      )}
      <div className="space-y-1">
        {eyebrow && (
          <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {eyebrow}
          </span>
        )}
        <h2 className="font-heading text-2xl leading-tight text-foreground sm:text-3xl">
          {title}
        </h2>
      </div>
    </div>
  );
}
