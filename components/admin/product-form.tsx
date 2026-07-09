"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import {
  createProductAction,
  updateProductAction,
} from "@/app/(admin)/admin/products/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_LABEL } from "@/lib/order-status";
import type { ProductCategory, ProductWithVariants } from "@/types";

const CATEGORIES = Object.keys(CATEGORY_LABEL) as ProductCategory[];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type VariantDraft = {
  label: string;
  priceOverride: string;
  stock: string;
};

/**
 * Create/edit form for a product. Mock phase: submitting validates lightly and
 * shows a toast, then returns to the list — nothing is persisted.
 */
export function ProductForm({
  product,
}: {
  product?: ProductWithVariants;
}) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? "unisex",
  );
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [stock, setStock] = useState(String(product?.stock ?? ""));
  const [notesTop, setNotesTop] = useState(product?.notesTop ?? "");
  const [notesMiddle, setNotesMiddle] = useState(product?.notesMiddle ?? "");
  const [notesBase, setNotesBase] = useState(product?.notesBase ?? "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [newImage, setNewImage] = useState("");
  const [variants, setVariants] = useState<VariantDraft[]>(
    product?.variants.map((v) => ({
      label: v.label,
      priceOverride: v.priceOverride != null ? String(v.priceOverride) : "",
      stock: String(v.stock),
    })) ?? [],
  );

  function onNameChange(value: string) {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  function addImage() {
    const url = newImage.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setNewImage("");
  }

  function moveImage(index: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function updateVariant(index: number, patch: Partial<VariantDraft>) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, ...patch } : v)),
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama produk wajib diisi");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Harga harus lebih dari 0");
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      category,
      price: Number(price),
      stock: Number(stock || 0),
      notesTop: notesTop.trim(),
      notesMiddle: notesMiddle.trim(),
      notesBase: notesBase.trim(),
      isActive,
      images,
      variants: variants
        .filter((v) => v.label.trim())
        .map((v) => ({
          label: v.label.trim(),
          priceOverride:
            v.priceOverride.trim() === "" ? null : Number(v.priceOverride),
          stock: Number(v.stock || 0),
        })),
    };

    startTransition(async () => {
      const res =
        isEdit && product
          ? await updateProductAction(product.id, payload)
          : await createProductAction(payload);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(
        isEdit ? `Produk "${name}" disimpan` : `Produk "${name}" dibuat`,
      );
      router.push("/admin/products");
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-8">
      {/* Basic fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="name">Nama Produk</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="mis. Sakura Senja"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(e.target.value);
            }}
            placeholder="sakura-senja"
          />
          <p className="text-xs text-muted-foreground">
            Otomatis dari nama; bisa disunting.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Kategori</Label>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as ProductCategory)}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Harga (IDR)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="289000"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stock">Stok</Label>
          <Input
            id="stock"
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Notes */}
      <fieldset className="space-y-4">
        <legend className="font-heading text-lg">Piramida Aroma</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="notesTop">Top Notes</Label>
            <Textarea
              id="notesTop"
              value={notesTop}
              onChange={(e) => setNotesTop(e.target.value)}
              placeholder="Bergamot, Pink Pepper"
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notesMiddle">Middle Notes</Label>
            <Textarea
              id="notesMiddle"
              value={notesMiddle}
              onChange={(e) => setNotesMiddle(e.target.value)}
              placeholder="Jasmine, Cherry Blossom"
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notesBase">Base Notes</Label>
            <Textarea
              id="notesBase"
              value={notesBase}
              onChange={(e) => setNotesBase(e.target.value)}
              placeholder="White Musk, Cedarwood"
              rows={2}
            />
          </div>
        </div>
      </fieldset>

      {/* Images */}
      <fieldset className="space-y-3">
        <legend className="font-heading text-lg">Gambar</legend>
        <p className="text-xs text-muted-foreground">
          Fase mock: tempel URL gambar (unggah UploadThing menyusul). Urutan
          pertama menjadi gambar utama.
        </p>
        <div className="flex gap-2">
          <Input
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="/products/placeholder.svg atau https://…"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImage();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={addImage}>
            <Plus /> Tambah
          </Button>
        </div>
        {images.length > 0 && (
          <ul className="space-y-2">
            {images.map((url, i) => (
              <li
                key={`${url}-${i}`}
                className="flex items-center gap-3 rounded-lg border border-border p-2"
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={url}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                  {url}
                </span>
                {i === 0 && (
                  <span className="text-xs font-medium text-terracotta">
                    Utama
                  </span>
                )}
                <div className="flex gap-0.5">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={i === 0}
                    onClick={() => moveImage(i, -1)}
                    aria-label="Naikkan"
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={i === images.length - 1}
                    onClick={() => moveImage(i, 1)}
                    aria-label="Turunkan"
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    aria-label="Hapus"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      {/* Variants */}
      <fieldset className="space-y-3">
        <legend className="font-heading text-lg">Varian</legend>
        <p className="text-xs text-muted-foreground">
          Ukuran/varian opsional. Kosongkan harga override untuk memakai harga
          dasar.
        </p>
        {variants.length > 0 && (
          <div className="space-y-2">
            {variants.map((v, i) => (
              <div key={i} className="flex flex-wrap items-end gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Label</Label>
                  <Input
                    value={v.label}
                    onChange={(e) => updateVariant(i, { label: e.target.value })}
                    placeholder="50ml"
                    className="w-28"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Harga override</Label>
                  <Input
                    type="number"
                    min={0}
                    value={v.priceOverride}
                    onChange={(e) =>
                      updateVariant(i, { priceOverride: e.target.value })
                    }
                    placeholder="—"
                    className="w-36"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Stok</Label>
                  <Input
                    type="number"
                    min={0}
                    value={v.stock}
                    onChange={(e) => updateVariant(i, { stock: e.target.value })}
                    placeholder="0"
                    className="w-24"
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    setVariants((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  aria-label="Hapus varian"
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setVariants((prev) => [
              ...prev,
              { label: "", priceOverride: "", stock: "" },
            ])
          }
        >
          <Plus /> Tambah Varian
        </Button>
      </fieldset>

      {/* Active toggle */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="size-4 accent-[var(--color-terracotta)]"
        />
        Produk aktif (tampil di storefront)
      </label>

      {/* Actions */}
      <div className="flex gap-2 border-t border-border pt-6">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Menyimpan…"
            : isEdit
              ? "Simpan Perubahan"
              : "Buat Produk"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/products")}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
