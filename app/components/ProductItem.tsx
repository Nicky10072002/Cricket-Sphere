import {useState} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {QuickCartModal} from '~/components/QuickCartModal';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="product-item relative group">
        <Link
          key={product.id}
          prefetch="intent"
          to={variantUrl}
          className="block"
        >
          <div className="relative overflow-hidden">
            {image && (
              <Image
                alt={image.altText || product.title}
                aspectRatio="1/1"
                data={image}
                loading={loading}
                sizes="(min-width: 45em) 400px, 100vw"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            )}
            
            {/* Quick Cart Button - Visible on Hover */}
            <button
              onClick={handleQuickCartClick}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 z-10"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Quick Add
            </button>
          </div>
          
          <div className="p-4">
            <h4 className="text-xl font-semibold">{product.title}</h4>
            <small>
              <Money data={product.priceRange.minVariantPrice} 
              className="text-lg font-medium text-gray-700"/>
            </small>
          </div>
        </Link>
      </div>

      {/* Quick Cart Modal */}
      <QuickCartModal
        product={product as any}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
