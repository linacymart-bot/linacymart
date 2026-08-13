'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBlogPost, updateBlogPost, deleteBlogPost } from '@/app/actions/admin-blog';
import { Save, ArrowLeft, Trash2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/components/admin/ImageUploader';

export function BlogForm({ post }: { post?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState(post?.cover_image || '');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = post 
      ? await updateBlogPost(post.id, formData)
      : await createBlogPost(formData);

    if (result.success) {
      router.push('/admin/blog');
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!post || !confirm('Are you sure you want to delete this blog post?')) return;
    
    setLoading(true);
    const result = await deleteBlogPost(post.id);
    
    if (result.success) {
      router.push('/admin/blog');
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/admin/blog" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Blog
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {post ? 'Edit Blog Post' : 'New Blog Post'}
          </h1>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {post && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] space-y-6">
            <h2 className="text-lg font-bold text-slate-900">General Information</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={post?.title}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                placeholder="The Benefits of Ganoderma..."
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">Content (Markdown)</label>
              <div className="text-xs text-slate-500 mb-2">Use [PRODUCT:slug] to embed a product.</div>
              <textarea
                id="content"
                name="content"
                required
                rows={15}
                defaultValue={post?.content}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors font-mono text-sm"
                placeholder="Write your article in markdown..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Publishing</h2>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                defaultValue={post?.slug}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                placeholder="benefits-of-ganoderma"
              />
            </div>

            <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                name="published"
                defaultChecked={post?.published}
                className="w-5 h-5 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
              />
              <div>
                <div className="font-medium text-slate-900">Published</div>
                <div className="text-xs text-slate-500">Make this post visible to the public.</div>
              </div>
            </label>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Cover Image</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload or URL</label>
              <input type="hidden" name="cover_image" value={coverImage} />
              <ImageUploader 
                value={coverImage} 
                onChange={setCoverImage} 
                bucket="images" 
                folder="blog-covers"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
