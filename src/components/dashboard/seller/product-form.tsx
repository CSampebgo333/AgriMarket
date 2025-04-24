"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  price: z.string().min(1, 'Price is required'),
  stock_quantity: z.string().min(1, 'Stock quantity is required'),
  weight: z.string().optional(),
  weight_unit: z.string().optional(),
  country_of_origin: z.string().optional(),
  expiry_date: z.string().optional(),
  manufacture_date: z.string().optional(),
  discount: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => Promise<void>;
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {},
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const onFormSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      
      // Append product data
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
          console.log(`Appending ${key}:`, value); // Debug log
        }
      });
      
      // Append images
      images.forEach((image) => {
        formData.append('images', image);
        console.log('Appending image:', image.name); // Debug log
      });
      
      console.log('Submitting form data...'); // Debug log
      await onSubmit(formData);
      
      toast.success(initialData ? 'Product updated successfully' : 'Product created successfully');
    } catch (error) {
      console.error('Form submission error:', error); // Debug log
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Product' : 'Add New Product'}</CardTitle>
        <CardDescription>
          {initialData ? 'Update your product details' : 'Fill in the details to add a new product'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select
                onValueChange={(value) => setValue('category_id', value)}
                defaultValue={initialData?.category_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Grains</SelectItem>
                  <SelectItem value="2">Vegetables</SelectItem>
                  <SelectItem value="3">Fruits</SelectItem>
                  <SelectItem value="4">Tubers</SelectItem>
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-red-500">{errors.category_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (XOF)</Label>
              <Input
                id="price"
                type="number"
                {...register('price')}
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                {...register('stock_quantity')}
                placeholder="Enter stock quantity"
              />
              {errors.stock_quantity && (
                <p className="text-sm text-red-500">{errors.stock_quantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                {...register('weight')}
                placeholder="Enter weight"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight_unit">Weight Unit</Label>
              <Select
                onValueChange={(value) => setValue('weight_unit', value)}
                defaultValue={initialData?.weight_unit}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="g">Gram (g)</SelectItem>
                  <SelectItem value="lb">Pound (lb)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country_of_origin">Country of Origin</Label>
              <Input
                id="country_of_origin"
                {...register('country_of_origin')}
                placeholder="Enter country of origin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="date"
                {...register('expiry_date')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacture_date">Manufacture Date</Label>
              <Input
                id="manufacture_date"
                type="date"
                {...register('manufacture_date')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                {...register('discount')}
                placeholder="Enter discount percentage"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter product description"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Product Images</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="text-sm text-muted-foreground">
              Upload up to 5 images. The first image will be used as the primary image.
            </p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Update Product' : 'Add Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 