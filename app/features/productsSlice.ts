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
  reducers: {},
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
      });
  },
});

export default productsSlice.reducer;
