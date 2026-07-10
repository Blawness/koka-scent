// Idempotent upsert of db/seed-data.ts into Neon. Only runs with DATABASE_URL
// set (fails fast otherwise — no point re-implementing the no-DB fallback here).
//
// Usage: pnpm db:seed  (loads .env.local via `node --env-file`)

import { eq } from "drizzle-orm";
import { db } from "./client";
import { productVariants, products } from "./schema";
import { seedProducts } from "./seed-data";

async function main() {
  if (!db) {
    console.error(
      "[db:seed] DATABASE_URL is not set — nothing to seed. Set it in .env.local to seed Neon.",
    );
    process.exit(1);
  }

  for (const product of seedProducts) {
    const [row] = await db
      .insert(products)
      .values({
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        category: product.category,
        price: product.price,
        images: product.images,
        notesTop: product.notesTop,
        notesMiddle: product.notesMiddle,
        notesBase: product.notesBase,
        stock: product.stock,
        isActive: product.isActive,
      })
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          sku: product.sku,
          name: product.name,
          category: product.category,
          price: product.price,
          images: product.images,
          notesTop: product.notesTop,
          notesMiddle: product.notesMiddle,
          notesBase: product.notesBase,
          stock: product.stock,
          isActive: product.isActive,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Replace variants wholesale — simplest idempotent strategy for seed data.
    await db.delete(productVariants).where(eq(productVariants.productId, row.id));

    if (product.variants.length > 0) {
      await db.insert(productVariants).values(
        product.variants.map((variant) => ({
          productId: row.id,
          label: variant.label,
          priceOverride: variant.priceOverride,
          stock: variant.stock,
        })),
      );
    }

    console.log(`[db:seed] upserted ${product.slug}`);
  }

  console.log(`[db:seed] done — ${seedProducts.length} products seeded.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[db:seed] failed:", err);
    process.exit(1);
  });
