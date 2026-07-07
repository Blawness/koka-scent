import { ProductDetail } from "./product-detail";

// Product detail page (PDP) — Feature 1. Server wrapper resolves the slug
// param; the client child fetches the product and handles variant selection.
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetail key={slug} slug={slug} />;
}
