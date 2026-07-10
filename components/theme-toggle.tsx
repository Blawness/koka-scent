"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Light/dark switch. Follows the OS until the user picks one, then next-themes
 * persists the choice. Renders a fixed-markup placeholder until mounted so the
 * server/client HTML matches (the real theme is only known on the client).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The resolved theme is only known on the client. Until mounted, every
  // rendered attribute must be theme-agnostic so the server and first client
  // render produce identical markup (otherwise React reports a hydration diff).
  const isDark = mounted && resolvedTheme === "dark";
  const label = !mounted
    ? "Ganti tema"
    : isDark
      ? "Aktifkan mode terang"
      : "Aktifkan mode gelap";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn("rounded-full", className)}
    >
      {mounted ? (
        isDark ? <Sun className="size-4" /> : <Moon className="size-4" />
      ) : (
        <Sun className="size-4 opacity-0" />
      )}
    </Button>
  );
}
