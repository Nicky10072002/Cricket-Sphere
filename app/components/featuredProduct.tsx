import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

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

        {/* Products List */}
        <div className="space-y-8 md:space-y-12">
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
  const {title, handle, priceRange, featuredImage, description} = product;

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100/50 hover:border-amber-300"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Image Container - Left Side */}
        <Link
          to={`/products/${handle}`}
          className="relative aspect-square md:aspect-auto overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 no-underline"
        >
          {featuredImage ? (
            <Image
              data={featuredImage}
              aspectRatio="1/1"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center min-h-[300px]">
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
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            Featured
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <span className="inline-flex items-center gap-2 text-white font-semibold text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </span>
            </div>
          </div>
        </Link>

        {/* Product Info - Right Side */}
        <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
          <Link to={`/products/${handle}`} className="no-underline">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-amber-900 mb-3 md:mb-4 group-hover:text-amber-700 transition-colors duration-300">
              {title}
            </h3>
          </Link>
          
          {/* Description */}
          {description && (
            <p className="text-amber-800/80 text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6 line-clamp-3">
              {description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 md:mb-8">
            <Money
              data={priceRange.minVariantPrice}
              className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-600 p-4"
            />
            <span className="text-amber-600/60 text-sm md:text-base">Starting from</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link
              to={`/products/${handle}`}
              className="flex-1 py-3 md:py-4 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 no-underline"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Add to Cart</span>
            </Link>
            <Link
              to={`/products/${handle}`}
              className="py-3 md:py-4 px-6 bg-white border-2 border-amber-500 text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-all duration-300 flex items-center justify-center gap-2 no-underline"
            >
              <span>View Details</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Features/Tags
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Premium Quality
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              In Stock
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              Free Shipping
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}