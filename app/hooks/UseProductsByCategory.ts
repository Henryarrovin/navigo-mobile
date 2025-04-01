import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByCategory } from '../features/productsSlice';
import { AppDispatch, RootState } from '../features/store';

interface UseProductsByCategory {
  products: any[];
  loading: boolean;
  error: string | null;
}

const useProductsByCategory = (categoryId: string): UseProductsByCategory => {
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (categoryId) {
        dispatch(fetchProductsByCategory(categoryId));
    }
    // Cleanup function to reset products when unmounting
    return () => {
        dispatch({ type: 'products/resetProducts' });
    };
  }, [categoryId, dispatch]);

  return {
    products: products || [],
    loading,
    error,
  };
};

export default useProductsByCategory;
