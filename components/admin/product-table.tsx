"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatIDR } from "@/lib/format";
import { CATEGORY_LABEL } from "@/lib/order-status";
import type { ProductWithVariants } from "@/types";

/**
 * Admin product list. Active state is local (mock phase — no persistence);
 * toggling only updates the row and shows a toast.
 */
export function ProductTable({
  products,
}: {
  products: ProductWithVariants[];
}) {
  const [active, setActive] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(products.map((p) => [p.id, p.isActive])),
  );

  function toggle(p: ProductWithVariants) {
    setActive((prev) => {
      const next = !prev[p.id];
      toast.success(
        next ? `"${p.name}" diaktifkan` : `"${p.name}" dinonaktifkan`,
      );
      return { ...prev, [p.id]: next };
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-14">Gambar</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead className="text-right">Harga</TableHead>
          <TableHead className="text-right">Stok</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => {
          const isActive = active[p.id];
          return (
            <TableRow key={p.id}>
              <TableCell>
                <div className="relative size-10 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={p.images[0] ?? "/products/placeholder.svg"}
                    alt={p.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {p.name}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {CATEGORY_LABEL[p.category]}
              </TableCell>
              <TableCell className="text-right">
                {formatIDR(p.price)}
              </TableCell>
              <TableCell className="text-right">
                <span className={p.stock < 5 ? "text-destructive" : undefined}>
                  {p.stock}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={isActive ? "default" : "outline"}>
                  {isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/products/${p.id}`}>Edit</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant={isActive ? "ghost" : "secondary"}
                    onClick={() => toggle(p)}
                  >
                    {isActive ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
