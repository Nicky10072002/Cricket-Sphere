import {useState} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {QuickCartModal} from '~/components/QuickCartModal';

interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    id: string;
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
  variants?: {
    nodes: Array<{
      id: string;
      title: string;
      availableForSale: boolean;
      price: {
        amount: string;
        currencyCode: string;
      };
    }>;
  };
}

interface BestSellerProductCardProps {
  product: Product;
  loading?: 'eager' | 'lazy';
}

export function BestSellerProductCard({
  product,
  loading = 'lazy',
}: BestSellerProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const image = product.featuredImage;

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
          to={`/products/${product.handle}`}
          className="block border-amber-800 border-1 rounded-xl"
        >
          <div className="relative overflow-hidden rounded-t-xl">
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
              className="absolute w-max bottom-4 left-1/2 -translate-x-1/2 opacity-0 cursor-pointer group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold px-6 py-3 rounded-4xl shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 z-10"
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
              <span className="text-white text-center mx-auto">Quick Add</span>
            </button>
          </div>
          
          <div className="p-4 bg-white rounded-b-xl">
            <h4 className="text-xl font-semibold text-amber-900 mb-2 line-clamp-1">{product.title}</h4>
            <Money 
              data={product.priceRange.minVariantPrice} 
              className="text-lg font-medium text-amber-600"
            />
          </div>
        </Link>
      </div>

      {/* Quick Cart Modal */}
      <QuickCartModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
