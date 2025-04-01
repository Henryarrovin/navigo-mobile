import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IProduct } from '../types/types';
import apiService from '@/services/apiService';

interface FetchProductsArgs {
  page: number;
  limit: number;
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, limit }: FetchProductsArgs, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/products?page=${page}&limit=${limit}`);
      return {
        products: response.data.data,
        pagination: response.data.pagination
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk<IProduct[], string>(
  'products/fetchProductsByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/products/category/${categoryId}`);
      if (!Array.isArray(response.data)) {
        return rejectWithValue('Invalid product data format');
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return rejectWithValue('No products found for this category');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products by category');
    }
  }
);

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProductsState {
  products: IProduct[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.products = [];
      state.loading = false;
      state.error = null;
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch products';
      })

      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.products = []; 
        state.error = action.payload as string || 'Failed to fetch products by category';
      });
  },
});

export default productsSlice.reducer;
