import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    // Convert FormData to a format the backend expects
    // const data = Object.fromEntries(formData.entries());
    const images = formData.getAll('images');
    
    // Create a new FormData for the backend request
    const backendFormData = new FormData();
    
    // Add all fields from the original form data
    for (const [key, value] of formData.entries()) {
      if (key !== 'images') {
        backendFormData.append(key, value);
      }
    }
    
    // Add images if they exist
    if (images && images.length > 0) {
      images.forEach((image) => {
        if (image instanceof File) {
          backendFormData.append('images', image);
        }
      });
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create product');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('seller_id');
    
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
    if (sellerId) {
      url.searchParams.append('seller_id', sellerId);
    }
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 