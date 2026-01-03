import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProductFiltersStore } from '@/features/product/store/productFiltersStore';

/**
 * Returns a navigation function that goes to the logical parent page
 * based on the page hierarchy, not browser history.
 *
 * Hierarchy:
 * - /products/:id → /products (with saved filters)
 * - /chat/:id → /chat
 * - /my/:tab → /my
 * - /user/:id → /products (or previous section)
 */
export function useHierarchicalBack() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const getProductSearchParams = useProductFiltersStore((state) => state.getSearchParams);

  const goBack = useCallback(() => {
    // /products/:id → /products with filters
    if (/^\/products\/[^/]+$/.test(pathname)) {
      navigate('/products' + getProductSearchParams());
      return;
    }

    // /chat/:id → /chat
    if (/^\/chat\/[^/]+$/.test(pathname)) {
      navigate('/chat');
      return;
    }

    // /my/:tab → /my
    if (/^\/my\/[^/]+$/.test(pathname)) {
      navigate('/my');
      return;
    }

    // /user/:id → /products with filters
    if (/^\/user\/[^/]+$/.test(pathname)) {
      navigate('/products' + getProductSearchParams());
      return;
    }

    // Default fallback to browser history
    navigate(-1);
  }, [pathname, navigate, getProductSearchParams]);

  return goBack;
}
