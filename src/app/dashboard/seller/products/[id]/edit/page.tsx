import { EditProductClient } from './client';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  return <EditProductClient productId={params.id} />;
} 