import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {FeaturedProducts} from '~/components/featuredProduct';
import { BlogPost } from '~/components/BlogPost';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  const blogs = context.storefront
    .query(BLOGS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
    blogs,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
      <BlogPosts blogs={data.blogs} />
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <Suspense fallback={
      <div className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            <p className="mt-4 text-amber-800">Loading featured products...</p>
          </div>
        </div>
      </div>
    }>
      <Await resolve={products}>
        {(response) => (
          response && response.products.nodes.length > 0 ? (
            <FeaturedProducts products={response.products.nodes} />
          ) : null
        )}
      </Await>
    </Suspense>
  );
}

function BlogPosts({blogs}: {blogs: Promise<any>}) {
  return (
    <Suspense fallback={
      <div className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            <p className="mt-4 text-amber-800">Loading blog posts...</p>
          </div>
        </div>
      </div>
    }>
      <Await resolve={blogs}>
        {(response) => {
          console.log('Blog response:', response);
          
          if (!response) {
            console.log('No response from blogs query');
            return null;
          }
          
          if (!response.blogs) {
            console.log('No blogs object in response');
            return null;
          }
          
          if (!response.blogs.nodes || response.blogs.nodes.length === 0) {
            console.log('No blog nodes found - make sure you have created a blog in Shopify Admin');
            return null;
          }
          
          const blog = response.blogs.nodes[0];
          console.log('Blog data:', blog);
          
          if (!blog.articles) {
            console.log('No articles object in blog');
            return null;
          }
          
          if (!blog.articles.nodes || blog.articles.nodes.length === 0) {
            console.log('No articles found - make sure you have published blog posts');
            return null;
          }
          
          const blogPosts = blog.articles.nodes.map((article: any) => ({
            id: article.id,
            title: article.title,
            excerpt: article.excerptHtml?.replace(/<[^>]*>/g, '') || article.excerpt || '',
            author: article.authorV2?.name || 'Cricket Sphere',
            date: new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            image: article.image?.url || undefined,
            handle: article.handle,
          }));
          
          return (
            <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-amber-50/30 via-white to-amber-50/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-14">
                  <div className="inline-flex items-center justify-center mb-4">
                    <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-amber-400"></div>
                    <span className="mx-3 md:mx-4 text-amber-600 font-semibold text-sm md:text-base uppercase tracking-wider">
                      📰 Latest Articles
                    </span>
                    <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-amber-400"></div>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-3 md:mb-4">
                    Cricket Insights & Tips
                  </h2>
                  <p className="text-amber-800/70 text-base md:text-lg max-w-2xl mx-auto">
                    Stay updated with the latest cricket gear reviews, maintenance tips, and expert advice
                  </p>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {blogPosts.map((post: any, index: number) => (
                    <BlogPost key={post.id} post={post} index={index} />
                  ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-10 md:mt-14">
                  <Link
                    to="/blogs"
                    className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 no-underline group"
                  >
                    <span>View All Articles</span>
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
        }}
      </Await>
    </Suspense>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    description
    descriptionHtml
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true, query: "tag:featured") {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

const BLOGS_QUERY = `#graphql
  query Blogs($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    blogs(first: 1) {
      nodes {
        articles(first: 3, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            id
            title
            handle
            excerpt
            excerptHtml
            publishedAt
            authorV2 {
              name
            }
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
` as const;
