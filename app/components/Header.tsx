import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-b border-amber-200/50 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <NavLink 
            prefetch="intent" 
            to="/" 
            end
            className="flex items-center space-x-2 group no-underline"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl md:text-2xl">🏏</span>
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">
              {shop.name}
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
          </div>
        </div>
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col space-y-1 p-4" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to="/"
          className={({isActive}) =>
            `px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 no-underline ${
              isActive
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 shadow-md'
                : 'text-amber-800 hover:bg-amber-100/80'
            }`
          }
        >
          Home
        </NavLink>
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;

          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              to={url}
              className={({isActive}) =>
                `px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 no-underline ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 shadow-md'
                    : 'text-amber-800 hover:bg-amber-100/80'
                }`
              }
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            to={url}
            className={({isActive}) =>
              `px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 no-underline ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 shadow-md'
                  : 'text-amber-800 hover:bg-amber-100/80 hover:text-amber-900'
              }`
            }
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <>
      {/* Desktop CTAs */}
      <div className="hidden md:flex items-center space-x-2">
        <SearchToggle />
        <NavLink 
          prefetch="intent" 
          to="/account"
          className="p-2.5 rounded-lg text-amber-800 hover:bg-amber-100/80 transition-all duration-200 hover:scale-105 no-underline "
          title="Account"
        >
          <Suspense fallback={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }>
            <Await resolve={isLoggedIn} errorElement={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }>
              {(isLoggedIn) => (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </Await>
          </Suspense>
        </NavLink>
        <CartToggle cart={cart} />
      </div>

      {/* Mobile CTAs */}
      <div className="flex md:hidden items-center space-x-1">
        <SearchToggle />
        <CartToggle cart={cart} />
        <HeaderMenuMobileToggle />
      </div>
    </>
  );
}

function HeaderMenuMobileToggle() {
  const {open, isOpen} = useAside();
  const isMobileMenuOpen = isOpen('mobile');
  
  return (
    <button
      className="p-2.5 rounded-lg text-amber-800 hover:bg-amber-100/80 transition-all duration-200 hover:scale-105 md:hidden"
      onClick={() => isMobileMenuOpen ? close() : open('mobile')}
      aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
    >
      {isMobileMenuOpen ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button 
      className="p-2.5 rounded-lg text-amber-800 hover:bg-amber-100/80 transition-all duration-200 hover:scale-105"
      onClick={() => open('search')}
      aria-label="Search"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      className="relative p-2.5 rounded-lg text-amber-800 hover:bg-amber-100/80 transition-all duration-200 hover:scale-105"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      aria-label={`Cart with ${count ?? 0} items`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

