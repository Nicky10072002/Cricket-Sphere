import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  const discountPercentage =
    price && compareAtPrice
      ? ((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) /
          parseFloat(compareAtPrice.amount)) *
        100
      : null;
  return (
    <div className="product-price mt-3 text-lg font-medium">
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <Money data={price} className="text-red-600 text-2xl" /> : null}
          <s>
            <Money data={compareAtPrice} className="text-gray-500" />
          </s>
          {discountPercentage ? (
            <span className="product-price-discount justify-center font-extrabold text-center bg-amber-950 text-white text-sm ml-2 p-2 rounded-4xl">
              {Math.round(discountPercentage)}% OFF
            </span>
          ) : null}

        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
