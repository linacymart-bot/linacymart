'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
}

export function ImageUploader({ 
  value, 
  onChange, 
  bucket = 'images',
  folder = 'uploads' 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
      
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image. Ensure the storage bucket exists and is public.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview Area */}
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center min-h-[200px]">
          <img src={value} alt="Uploaded preview" className="max-w-full max-h-[300px] object-contain" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[200px]"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
              <p className="text-sm font-medium text-slate-700">Uploading...</p>
            </>
          ) : (
            <>
              <ImageIcon className="w-10 h-10 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-700">Click to upload an image</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG, WebP up to 5MB</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      
      {/* Fallback Manual URL Input */}
      <div className="mt-4">
        <label className="block text-xs font-medium text-slate-500 mb-1">Or paste image URL directly</label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full text-sm rounded-lg border-slate-300 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
    </div>
  );
}
