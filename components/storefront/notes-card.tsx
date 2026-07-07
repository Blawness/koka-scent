import { Card, CardContent } from "@/components/ui/card";

const LAYERS = [
  { key: "top", label: "Top Notes" },
  { key: "middle", label: "Middle Notes" },
  { key: "base", label: "Base Notes" },
] as const;

export function NotesCard({
  notesTop,
  notesMiddle,
  notesBase,
}: {
  notesTop: string;
  notesMiddle: string;
  notesBase: string;
}) {
  const values: Record<(typeof LAYERS)[number]["key"], string> = {
    top: notesTop,
    middle: notesMiddle,
    base: notesBase,
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-secondary/40">
      <CardContent className="space-y-4">
        <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Aroma
        </span>
        <div className="space-y-3">
          {LAYERS.map((layer, i) => (
            <div key={layer.key} className="flex items-start gap-3">
              <span className="display-number mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-background/70 text-sm text-terracotta">
                {i + 1}
              </span>
              <div>
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  {layer.label}
                </p>
                <p className="text-sm text-foreground">{values[layer.key]}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
