'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/app/actions/admin-products';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/components/admin/ImageUploader';

export default function ProductForm({ 
  initialData, 
  categories 
}: { 
  initialData?: any,
  categories: any[]
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(initialData?.product_images?.[0]?.url || '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = initialData 
        ? await updateProduct(initialData.id, formData)
        : await createProduct(formData);
        
      if (result.success) {
        router.push('/admin/products');
      } else {
        setError(result.error || 'Failed to save product');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-slate-200 bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          {initialData ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Product Name</label>
            <input 
              name="name" 
              defaultValue={initialData?.name} 
              required 
              className="w-full bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none" 
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Slug (URL friendly name)</label>
            <input 
              name="slug" 
              defaultValue={initialData?.slug} 
              required 
              className="w-full bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Regular Price (KSh)</label>
            <input 
              name="price" 
              type="number" 
              step="0.01" 
              defaultValue={initialData?.price} 
              required 
              className="w-full bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Sale Price (KSh - Optional)</label>
            <input 
              name="sale_price" 
              type="number" 
              step="0.01" 
              defaultValue={initialData?.sale_price || ''} 
              className="w-full bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none" 
            />
            <p className="text-xs text-slate-500 mt-1">Leave empty if no active offer.</p>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <select 
              name="category_id" 
              defaultValue={initialData?.category_id} 
              required
              className="w-full bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none"
            >
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Image URL</label>
            <input type="hidden" name="image_url" value={imageUrl} />
            <ImageUploader 
              value={imageUrl} 
              onChange={setImageUrl} 
              bucket="images" 
              folder="products"
            />
          </div>
          
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea 
              name="description" 
              defaultValue={initialData?.full_description} 
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none" 
            />
          </div>
          
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Benefits</label>
            <textarea 
              name="benefits" 
              defaultValue={initialData?.short_description} 
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Ingredients</label>
            <textarea 
              name="ingredients" 
              defaultValue={initialData?.ingredients} 
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Directions</label>
            <textarea 
              name="directions" 
              defaultValue={initialData?.directions} 
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none" 
            />
          </div>
        </div>

        <div className="flex gap-6 border-t border-slate-100 pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              name="active" 
              defaultChecked={initialData ? initialData.active : true} 
              className="w-5 h-5 text-primary-600 rounded border-slate-300 focus:ring-primary-500" 
            />
            <span className="text-sm font-medium text-slate-700">Active (Visible in store)</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              name="featured" 
              defaultChecked={initialData ? initialData.featured : false} 
              className="w-5 h-5 text-primary-600 rounded border-slate-300 focus:ring-primary-500" 
            />
            <span className="text-sm font-medium text-slate-700">Featured (Show on homepage)</span>
          </label>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending}
            className="flex items-center gap-2 bg-primary-900 hover:bg-primary-800 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
