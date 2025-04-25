import { ProductDetailClient } from './client';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;
  return <ProductDetailClient productId={id} />;
} 