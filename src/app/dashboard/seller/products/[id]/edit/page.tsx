import { EditProductClient } from './client';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  return <EditProductClient productId={id} />;
} 