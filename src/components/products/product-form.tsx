import React, { useState, useEffect } from 'react';

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  status: string;
  image?: string;
}

interface ProductFormProps {
  product: Product | null;
  onSubmit: (formData: FormData) => Promise<void>;
}

interface ProductFormData {
  name: string;
  price: string;
  category: string;
  quantity: string;
  description: string;
  image?: File;
}

const ProductForm = ({ product, onSubmit }: ProductFormProps) => {
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [formValues, setFormValues] = useState<ProductFormData>({
    name: '',
    price: '',
    category: '',
    quantity: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      const newFormData = new FormData();
      const newValues: ProductFormData = {
        name: product.name || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        quantity: product.quantity?.toString() || '',
        description: product.description || '',
      };
      
      Object.entries(newValues).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          newFormData.append(key, value);
        }
      });
      
      setFormData(newFormData);
      setFormValues(newValues);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await onSubmit(formData);
      setSuccess('Product saved successfully!');
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = new FormData();
    // Copy existing form data
    for (const [key, val] of formData.entries()) {
      newFormData.append(key, val);
    }
    newFormData.set(name, value);
    setFormData(newFormData);
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const newFormData = new FormData();
      // Copy existing form data
      for (const [key, val] of formData.entries()) {
        newFormData.append(key, val);
      }
      newFormData.set(name, files[0]);
      setFormData(newFormData);
      setFormValues(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formValues.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formValues.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a category</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
            <option value="meat">Meat</option>
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity Available
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formValues.quantity}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formValues.description}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Product Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          className="mt-1 block w-full"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 