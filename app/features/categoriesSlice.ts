import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ICategory } from '../types/types';
import apiService from '@/services/apiService';

export const fetchCategories = createAsyncThunk<ICategory[]>(
  'categories/fetchCategories',
  async () => {
    const response = await apiService.get('/categories');
    return response.data;
  }
);

interface CategoriesState {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export default categoriesSlice.reducer;
