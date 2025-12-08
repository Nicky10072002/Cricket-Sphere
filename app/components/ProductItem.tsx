import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

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
  return (
    <Link
      className="product-item hover:bg-amber-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <Image
          alt={image.altText || product.title}
          aspectRatio="1/1"
          data={image}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <div className="p-4 bg-amber-50 border-b-gray-300 border-b">
      <h4 className="text-xl font-semibold line-clamp-1">{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} 
        className="text-lg font-medium text-gray-700"/>
      </small>
      </div>
    </Link>
  );
}
