import { useQuery } from "@tanstack/react-query";
import type { ProductWithVariants } from "@/types";

type ApiResponse<T> = { data: T } | { error: string };

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || "error" in body) {
    const message = "error" in body ? body.error : "Gagal memuat data";
    throw new Error(message);
  }
  return body.data;
}

/** All active products — client-side filter/search happens in the catalog UI. */
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchJson<ProductWithVariants[]>("/api/products"),
  });
}
