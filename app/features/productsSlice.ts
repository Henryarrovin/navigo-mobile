import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IProduct } from '../types/types';
import apiService from '@/services/apiService';

interface FetchProductsArgs {
  page: number;
  limit: number;
}

interface ProductResponse {
  product: IProduct;
}

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
  currentProduct: IProduct | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
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

export const fetchProductById = createAsyncThunk<ProductResponse, string>(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/products/${productId}`);
      return {
        product: response.data
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return rejectWithValue('Product not found');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

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
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
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
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload.product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.currentProduct = null;
        state.error = action.payload as string || 'Failed to fetch product';
      });
  },
});

export const { resetProducts, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;
