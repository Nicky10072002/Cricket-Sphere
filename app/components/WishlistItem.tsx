import { Link } from 'react-router';
import type { WishlistItem as WishlistItemType } from '~/hooks/useWishlist';
import { AddToCartButton } from './AddToCartButton';
import { useState } from 'react';

interface WishlistItemProps {
  item: WishlistItemType;
  onRemove: (variantId: string) => void;
}

export function WishlistItem({ item, onRemove }: WishlistItemProps) {
  const [quantity] = useState(1);

  return (
    <div className="wishlist-item border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link to={`/products/${item.handle}`} className="flex-shrink-0">
          {item.image ? (
            <img
              src={item.image.url}
              alt={item.image.altText || item.title}
              className="w-24 h-24 object-cover rounded-md"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </Link>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <Link 
              to={`/products/${item.handle}`}
              className="text-lg font-semibold text-gray-900 hover:text-amber-700 transition-colors"
            >
              {item.title}
            </Link>
            <p className="text-amber-700 font-bold mt-1">
              {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
            </p>
            {!item.availableForSale && (
              <p className="text-red-600 text-sm mt-1">Out of Stock</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <AddToCartButton
              disabled={!item.availableForSale}
              lines={[
                {
                  merchandiseId: item.variantId,
                  quantity,
                },
              ]}
              className="flex-1"
            >
              Add to Cart
            </AddToCartButton>
            <button
              onClick={() => onRemove(item.variantId)}
              className="mt-4 px-4 py-1 bg-red-600 text-white font-semibold rounded-4xl hover:bg-red-700 transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
