import { ProductDetailClient } from './client';



export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  return <ProductDetailClient productId={id} />;
} 