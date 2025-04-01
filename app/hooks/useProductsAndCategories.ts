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
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const useProductsAndCategories = (): UseProductsAndCategories => {
const dispatch = useDispatch<AppDispatch>();

  // Get state from Redux
  const { 
    products, 
    loading: productsLoading, 
    error: productsError, 
    pagination 
  } = useSelector(
    (state: RootState) => state.products
  );
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useSelector(
    (state: RootState) => state.categories
  );

  // Fetch products and categories when component mounts
  // useEffect(() => {
  //   dispatch(fetchProducts({ page: 1, limit: 10 }));
  //   dispatch(fetchCategories());
  // }, [dispatch]);
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchProducts({ page: 1, limit: 10 })),
          dispatch(fetchCategories())
        ]);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };
    
    loadData();
  }, [dispatch]);

  return {
    products,
    categories,
    productsLoading,
    categoriesLoading,
    productsError,
    categoriesError,
    pagination,
  };
};

export default useProductsAndCategories;
