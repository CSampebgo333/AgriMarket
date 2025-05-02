import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/lib/api';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const formData = await request.formData();
    
    // Log the received form data
    console.log("Received form data:", Object.fromEntries(formData.entries()));

    // Get existing images and new images
    const existingImages = formData.get('existing_images') as string;
    const existingImagesArray = existingImages ? JSON.parse(existingImages) : [];
    const newImages = formData.getAll('images') as File[];

    // Create a new FormData for the backend
    const backendFormData = new FormData();
    
    // Add all non-file fields to the backend FormData
    for (const [key, value] of formData.entries()) {
      if (key !== 'images' && key !== 'existing_images') {
        backendFormData.append(key, value as string);
      }
    }

    // Add existing images
    backendFormData.append('existing_images', JSON.stringify(existingImagesArray));

    // Add new images
    for (const image of newImages) {
      backendFormData.append('images', image);
    }

    // Log the data being sent to the backend
    console.log("Sending to backend:", {
      id,
      existingImages: existingImagesArray,
      newImagesCount: newImages.length,
    });

    const response = await productService.update(parseInt(id), backendFormData);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch product' },
      { status: 500 }
    );
  }
} 