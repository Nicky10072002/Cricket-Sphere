import {useState} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {QuickCartModal} from '~/components/QuickCartModal';

interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  priceRange: {
    minVariantPrice: MoneyV2;
  };
  featuredImage?: {
    id: string;
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
}

interface BestsellerSectionProps {
  products: Product[];
}

export function BestsellerSection({products}: BestsellerSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  // Show only first 4 products
  const displayProducts = products.slice(0, 4);
  const hasMoreProducts = products.length > 4;

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-amber-400"></div>
            <span className="mx-3 md:mx-4 text-amber-600 font-semibold text-sm md:text-base uppercase tracking-wider">
              ⭐ Top Picks
            </span>
            <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-3 md:mb-4">
            Best Sellers
          </h2>
          <p className="text-amber-800/70 text-base md:text-lg max-w-2xl mx-auto">
            Most loved by cricket enthusiasts worldwide
          </p>
        </div>

        {/* Products Grid - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {displayProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Show More Button - Only if more than 4 products */}
        {hasMoreProducts && (
          <div className="text-center mt-10 md:mt-14">
            <Link
              to="/collections/bestsellers"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 no-underline group"
            >
              <span>Show More</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({product, index}: {product: Product; index: number}) {
  const {title, handle, priceRange, featuredImage} = product;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100/50 hover:border-amber-300"
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        {/* Image Container */}
        <Link
          to={`/products/${handle}`}
          className="relative block aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 no-underline"
        >
          {featuredImage ? (
            <Image
              data={featuredImage}
              aspectRatio="1/1"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-amber-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Bestseller Badge */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            Bestseller
          </div>

          {/* Quick Cart Button - Visible on Hover */}
          <button
            onClick={handleQuickCartClick}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 z-10 text-sm"
          >
            <svg
              className="w-4 h-4"
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
        </Link>

        {/* Product Info */}
        <div className="p-4">
          <Link to={`/products/${handle}`} className="no-underline">
            <h3 className="text-lg font-bold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors duration-300 line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <Money
              data={priceRange.minVariantPrice}
              className="text-xl font-bold text-amber-600"
            />
          </div>

          {/* View Details Button */}
          <Link
            to={`/products/${handle}`}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 no-underline text-sm"
          >
            <span>View Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
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
