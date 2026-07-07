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
    <Card className="bg-secondary/40">
      <CardContent className="space-y-4">
        <h2 className="font-heading text-lg text-foreground">
          Profil Aroma
        </h2>
        <div className="space-y-3">
          {LAYERS.map((layer, i) => (
            <div key={layer.key} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
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
