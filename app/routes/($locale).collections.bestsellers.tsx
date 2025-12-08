import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections.bestsellers';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import type {ProductItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Hydrogen | Best Sellers'}];
};

export async function loader(args: Route.LoaderArgs) {
  const {context, request} = args;
  const {storefront} = context;
  
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const {products} = await storefront.query(BESTSELLER_PRODUCTS_QUERY, {
    variables: {...paginationVariables},
  });

  return {products};
}

export default function BestsellersCollection() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="bestsellers-collection p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-amber-600">
        <Link to="/" className="hover:text-amber-800 transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-amber-900 font-semibold">Best Sellers</span>
      </nav>

      {/* Header */}
      <div className="collection-header mb-10 text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-amber-400"></div>
          <span className="mx-3 md:mx-4 text-amber-600 font-semibold text-sm md:text-base uppercase tracking-wider">
            ⭐ Top Picks
          </span>
          <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-amber-400"></div>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-4">
          Best Selling Products
        </h1>
        <p className="text-amber-800/70 text-lg md:text-xl max-w-3xl mx-auto">
          Discover our most popular cricket gear, trusted by players worldwide
        </p>
      </div>

      {/* Products Grid */}
      <PaginatedResourceSection<ProductItemFragment>
        connection={products}
        resourcesClassName="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {({node: product, index}) => (
          <div
            key={product.id}
            className="product-item bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-amber-100/50 hover:border-amber-300"
          >
            <ProductItem
              product={product}
              loading={index < 8 ? 'eager' : undefined}
            />
          </div>
        )}
      </PaginatedResourceSection>

      <Analytics.CustomView
        type="custom_bestsellers"
        data={{
          collection: {
            handle: 'bestsellers',
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

const BESTSELLER_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query BestsellerProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: UPDATED_AT,
      reverse: true,
      query: "tag:bestseller"
    ) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
` as const;
