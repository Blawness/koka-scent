"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades + lifts its children into view once, when they first intersect.
 *
 * The hidden state lives in CSS (`[data-reveal]` in globals.css), so it applies
 * during SSR with no flash of already-visible content. Two escape hatches keep
 * that from stranding anyone with permanently invisible content:
 *
 *   1. `<noscript>` in the root layout un-hides everything.
 *   2. Browsers without IntersectionObserver reveal immediately, below.
 *
 * Reduced-motion users skip the transition entirely (also handled in CSS), so
 * this component still mounts — it just has nothing to animate.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger, in ms. Keep under ~400 — beyond that it reads as broken, not choreographed. */
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No observer (ancient browser): reveal immediately. Written straight to the
    // DOM rather than through setState — a synchronous setState in an effect
    // cascades an extra render for every Reveal on the page.
    if (typeof IntersectionObserver === "undefined") {
      node.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect(); // reveal once; re-animating on scroll-back is nauseating
      },
      {
        // Bottom margin holds the reveal until the element is a little past the
        // fold, so the motion finishes as it settles into view.
        //
        // The enormous top margin is load-bearing, not a typo. An observer only
        // fires when intersection *changes*; an element that the page jumps
        // clean over — anchor link, scroll restoration on reload, Ctrl+End —
        // reads as non-intersecting both before and after, so the callback
        // never runs and the content stays at opacity 0 forever. Extending the
        // root far above the viewport means anything already scrolled past
        // counts as intersecting, and reveals.
        rootMargin: "100000px 0px -8% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-visible={visible ? "true" : "false"}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
