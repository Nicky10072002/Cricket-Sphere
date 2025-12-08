import {useState, useEffect} from 'react';
import {Image, Money, CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {Link, type FetcherWithComponents} from 'react-router';

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

interface QuickCartModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickCartModal({product, isOpen, onClose}: QuickCartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsAdded(false);
      // Set first available variant as default
      if (product.variants?.nodes && product.variants.nodes.length > 0) {
        const firstAvailable = product.variants.nodes.find(v => v.availableForSale);
        if (firstAvailable) {
          setSelectedVariantId(firstAvailable.id);
        }
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, product]);

  if (!isOpen) return null;

  const lines: Array<OptimisticCartLineInput> = selectedVariantId
    ? [
        {
          merchandiseId: selectedVariantId,
          quantity,
        },
      ]
    : [];

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => {
      onClose();
      setIsAdded(false);
      setQuantity(1);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
            {product.featuredImage ? (
              <Image
                data={product.featuredImage}
                aspectRatio="1/1"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="w-full h-full object-cover"
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
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-3">
              {product.title}
            </h2>

            {/* Price */}
            <div className="mb-4">
              <Money
                data={product.priceRange.minVariantPrice}
                className="text-3xl font-bold text-amber-600"
              />
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Variant Selection */}
            {product.variants?.nodes && product.variants.nodes.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Variant
                </label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none"
                >
                  {product.variants.nodes.map((variant) => (
                    <option
                      key={variant.id}
                      value={variant.id}
                      disabled={!variant.availableForSale}
                    >
                      {variant.title} - ${variant.price.amount}
                      {!variant.availableForSale && ' (Out of Stock)'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-amber-300 text-amber-700 font-bold hover:bg-amber-50 transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center px-3 py-2 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none font-semibold"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-amber-300 text-amber-700 font-bold hover:bg-amber-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <CartForm
              route="/cart"
              inputs={{lines}}
              action={CartForm.ACTIONS.LinesAdd}
            >
              {(fetcher: FetcherWithComponents<any>) => (
                <button
                  type="submit"
                  onClick={handleAddToCart}
                  disabled={!selectedVariantId || fetcher.state !== 'idle'}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:shadow-xl hover:scale-105'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isAdded ? (
                    <>
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Added to Cart!
                    </>
                  ) : (
                    <>
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
                      Add to Cart
                    </>
                  )}
                </button>
              )}
            </CartForm>

            {/* View Full Details Link */}
            <Link
              to={`/products/${product.handle}`}
              className="mt-4 text-center py-3 px-6 border-2 border-amber-500 text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-all duration-300 no-underline"
              onClick={onClose}
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
