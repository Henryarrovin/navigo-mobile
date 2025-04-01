import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/productsSlice';
import { fetchCategories } from '../features/categoriesSlice';
import { ICategory, IProduct } from '../types/types';
import { AppDispatch, RootState } from '../features/store';

interface UseProductsAndCategories {
  products: IProduct[];
  categories: ICategory[];
  productsLoading: boolean;
  categoriesLoading: boolean;
  productsError: string | null;
  categoriesError: string | null;
}

const useProductsAndCategories = (): UseProductsAndCategories => {
const dispatch = useDispatch<AppDispatch>();

  // Get state from Redux
  const { products, loading: productsLoading, error: productsError } = useSelector(
    (state: RootState) => state.products
  );
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector(
    (state: RootState) => state.categories
  );

  // Fetch products and categories when component mounts
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  return {
    products,
    categories,
    productsLoading,
    categoriesLoading,
    productsError,
    categoriesError,
  };
};

export default useProductsAndCategories;
