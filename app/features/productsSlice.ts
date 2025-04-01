import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IProduct } from '../types/types';
import apiService from '@/services/apiService';

export const fetchProducts = createAsyncThunk<IProduct[]>(
  'products/fetchProducts',
  async () => {
    const response = await apiService.get('/products');
    return response.data;
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

interface ProductsState {
  products: IProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.products = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
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
