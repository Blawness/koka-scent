"use client";

import { useEffect, useState } from "react";
import { CheckIcon, TruckIcon } from "lucide-react";
import { formatIDR } from "@/lib/format";
import type { ShippingRate } from "@/lib/shipping";

// Fetches dummy shipping rates once city + postal code are filled, and lets
// the shopper pick one. Rates are stubbed (Global Constraints — no real
// courier API in this demo).
export function ShippingCostBox({
  city,
  postal,
  weightGrams,
  selected,
  onSelect,
}: {
  city: string;
  postal: string;
  weightGrams: number;
  selected: ShippingRate | null;
  onSelect: (rate: ShippingRate | null) => void;
}) {
  // `rates === null` means "not yet loaded for the current address" (either
  // still fetching, or not ready). Kept this way — rather than a separate
  // "loading" flag toggled synchronously at the top of the effect — so the
  // only setState calls happen inside the fetch's async callbacks.
  const [rates, setRates] = useState<ShippingRate[] | null>(null);
  const [error, setError] = useState(false);

  const ready = city.trim().length > 0 && postal.trim().length >= 4;

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    fetch("/api/shipping/cost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinationCity: city,
        destinationPostalCode: postal,
        weightGrams,
      }),
    })
      .then((res) => res.json())
      .then((body: { data?: ShippingRate[] }) => {
        if (cancelled) return;
        setRates(body.data ?? []);
        setError(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [ready, city, postal, weightGrams]);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 font-heading text-xl text-foreground">
        <TruckIcon className="size-4 text-terracotta" />
        Ongkos Kirim
      </h2>

      {!ready && (
        <p className="text-sm text-muted-foreground">
          Isi kota dan kode pos untuk melihat pilihan pengiriman.
        </p>
      )}

      {ready && rates === null && !error && (
        <p className="text-sm text-muted-foreground">Menghitung ongkir…</p>
      )}

      {ready && error && (
        <p className="text-sm text-destructive">
          Gagal memuat ongkos kirim. Coba lagi.
        </p>
      )}

      {ready && rates !== null && !error && (
        <div className="space-y-2">
          {rates.map((rate) => {
            const isSelected =
              selected?.courier === rate.courier &&
              selected?.service === rate.service;
            return (
              <button
                key={`${rate.courier}-${rate.service}`}
                type="button"
                onClick={() => onSelect(rate)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                  isSelected
                    ? "border-terracotta ring-2 ring-terracotta bg-accent"
                    : "border-border hover:bg-muted"
                }`}
              >
                <span className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {rate.courier} — {rate.service}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Estimasi {rate.etd} hari
                  </span>
                </span>
                <span className="flex items-center gap-2 tabular-nums text-foreground">
                  {formatIDR(rate.cost)}
                  {isSelected && (
                    <CheckIcon className="size-4 text-terracotta" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
