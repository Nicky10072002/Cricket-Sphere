import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

interface Product {
  id: string;
  title: string;
  handle: string;
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

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function FeaturedProducts({
  products,
  title = 'Featured Products',
  subtitle = 'Discover our handpicked selection of premium cricket gear',
}: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-amber-400"></div>
            <span className="mx-3 md:mx-4 text-amber-600 font-semibold text-sm md:text-base uppercase tracking-wider">
              🏏 Best Sellers
            </span>
            <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-3 md:mb-4">
            {title}
          </h2>
          <p className="text-amber-800/70 text-base md:text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10 md:mt-14">
          <Link
            to="/collections/all"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 no-underline group"
          >
            <span>View All Products</span>
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
      </div>
    </section>
  );
}

function ProductCard({product, index}: {product: Product; index: number}) {
  const {title, handle, priceRange, featuredImage} = product;

  return (
    <Link
      to={`/products/${handle}`}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden no-underline border border-amber-100/50 hover:border-amber-300 flex flex-col"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
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
              className="w-20 h-20 text-amber-300"
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
        
        {/* Overlay Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          New
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="inline-flex items-center gap-2 text-white font-semibold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Quick View
            </span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 md:p-5 flex-1 flex flex-col">
        <h3 className="text-base md:text-lg font-semibold text-amber-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors duration-300">
          {title}
        </h3>
        
        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <Money
              data={priceRange.minVariantPrice}
              className="text-xl md:text-2xl font-bold text-amber-600"
            />
          </div>

          {/* Add to Cart Button */}
          <button className="w-full py-2.5 md:py-3 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 font-semibold rounded-lg group-hover:from-amber-500 group-hover:to-yellow-500 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm md:text-base">Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Link>
  );
}