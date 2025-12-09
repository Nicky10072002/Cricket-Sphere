'use client';

import {BestSellerProductCard} from './BestSellerProductCard';

export function BestSellerSection({products}: {products: any}) {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-amber-50/30 via-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-amber-400"></div>
            <span className="mx-3 md:mx-4 text-amber-600 font-semibold text-sm md:text-base uppercase tracking-wider">
              📊 Best Sellers
            </span>
            <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-3 md:mb-4">
            Top Picks for You
          </h2>
          <p className="text-amber-800/70 text-base md:text-lg max-w-7xl mx-auto">
            Discover our best-selling products, carefully curated to meet your
            needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products?.nodes?.map((product: any) => (
            <BestSellerProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}