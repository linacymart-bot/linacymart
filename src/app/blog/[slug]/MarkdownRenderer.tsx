'use client';

import React from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

interface MarkdownRendererProps {
  content: string;
  products: Record<string, any>;
}

export function MarkdownRenderer({ content, products }: MarkdownRendererProps) {
  // Pre-process the markdown to convert [PRODUCT:slug] into a custom JSX tag <product-embed slug="slug" />
  // ReactMarkdown doesn't support custom shortcodes natively, but we can replace it with a blockquote or custom HTML
  // Alternatively, we can use a custom element approach if we enable rehypeRaw, but a safer way is replacing with a specific link pattern.
  // We'll replace [PRODUCT:slug] with a link like: [__EMBED__slug](/products/slug)
  // Then we intercept the 'a' tag in ReactMarkdown components.
  
  const processedContent = content.replace(/\[PRODUCT:([a-zA-Z0-9-]+)\]/g, '[__EMBED__$1](/products/$1)');

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node, href, children, ...props }) => {
          const childrenArray = React.Children.toArray(children);
          const text = childrenArray[0];
          
          if (typeof text === 'string' && text.startsWith('__EMBED__')) {
            const slug = text.replace('__EMBED__', '');
            const product = products[slug];
            
            if (!product) {
              return <span className="text-red-500">[Product {slug} not found]</span>;
            }

            const primaryImg = product.product_images?.find((img: any) => img.is_primary)?.url 
              || product.product_images?.[0]?.url 
              || '/placeholder.svg';

            return (
              <Link 
                href={`/products/${product.slug}`}
                className="not-prose my-8 block max-w-sm w-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group no-underline"
              >
                <div className="flex h-32">
                  <div className="w-1/3 bg-slate-50 flex items-center justify-center p-2 border-r border-slate-100">
                    <img 
                      src={primaryImg} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="w-2/3 p-4 flex flex-col justify-center">
                    <h3 className="font-bold text-slate-900 leading-tight mb-1">{product.name}</h3>
                    {product.sale_price ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-red-600">KSh {Number(product.sale_price).toLocaleString()}</span>
                        <span className="text-xs text-slate-400 line-through">KSh {Number(product.price).toLocaleString()}</span>
                      </div>
                    ) : (
                      <div className="font-bold text-slate-900">KSh {Number(product.price).toLocaleString()}</div>
                    )}
                    <div className="mt-2 text-xs font-bold text-primary-600 group-hover:text-primary-700">
                      View Product &rarr;
                    </div>
                  </div>
                </div>
              </Link>
            );
          }
          
          return (
            <a href={href} {...props} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        }
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}
