-- Guest checkout now collects an email: it is the delivery address for order
-- confirmations, and the join key for linking guest orders to Neon Auth
-- accounts once customer login lands.
--
-- Two pre-launch test orders predate the column and carry no email. They are
-- removed by order_number (not a blanket DELETE) so this migration cannot wipe
-- real orders if it ever runs against another database. order_items cascades.
DELETE FROM "orders" WHERE "order_number" IN ('KS-20260707-0001', 'KS-20260707-0002');--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customer_email" text NOT NULL;--> statement-breakpoint
-- Nullable, no FK: Neon Auth owns its tables in the neon_auth schema and we
-- never reach them through Drizzle. text, not uuid — Better Auth ids are
-- opaque strings. Null means guest checkout.
ALTER TABLE "orders" ADD COLUMN "user_id" text;
