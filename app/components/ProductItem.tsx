import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
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
        </div>
        
        <div className="p-4">
          <h4 className="text-xl font-semibold line-clamp-1">{product.title}</h4>
          <small>
            <Money data={product.priceRange.minVariantPrice} 
            className="text-lg font-medium text-gray-700"/>
          </small>
        </div>
      </Link>
    </div>
  );
}
