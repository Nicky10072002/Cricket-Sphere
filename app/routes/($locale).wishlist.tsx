import { Link } from 'react-router';
import { useWishlist } from '~/hooks/useWishlist';
import { WishlistItem } from '~/components/WishlistItem';

export const meta = () => {
  return [{ title: 'Cricket Sphere | Wishlist' }];
};

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();

  return (
    <div className="wishlist-page max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-amber-700 fill-amber-700" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
          <span className="bg-amber-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
          </span>
        </div>
        {wishlistCount > 0 && (
          <button
            onClick={clearWishlist}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-4xl hover:bg-red-700 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Wishlist Items */}
      {wishlistCount === 0 ? (
        <div className="text-center py-16">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">
            Start adding products you love to your wishlist!
          </p>
          <Link
            to="/collections/all"
            className="inline-block px-6 py-3 bg-amber-700 text-white font-bold rounded-4xl hover:bg-amber-800 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {wishlistItems.map((item) => (
            <WishlistItem
              key={item.variantId}
              item={item}
              onRemove={removeFromWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
