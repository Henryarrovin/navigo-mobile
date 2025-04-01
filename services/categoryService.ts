import { IApiResponse, ICategory } from "@/app/types/types";
import apiService from "./apiService";

export const createCategory = async (categoryName: string): Promise<IApiResponse<ICategory>> => {
  try {
    const response = await apiService.post('/categories', { name: categoryName });
    return response.data;
  } catch (error) {
    console.error("Error creating category", error);
    throw error;
  }
};

export const getAllCategories = async (): Promise<IApiResponse<ICategory[]>> => {
  try {
    const response = await apiService.get('/categories');
    return response.data;
  } catch (error) {
    console.error("Error fetching categories", error);
    throw error;
  }
};

export const getCategoryById = async (id: string): Promise<IApiResponse<ICategory>> => {
  try {
    const response = await apiService.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category by ID", error);
    throw error;
  }
};

export const updateCategory = async (id: string, categoryName: string): Promise<IApiResponse<ICategory>> => {
  try {
    const response = await apiService.put(`/categories/${id}`, { name: categoryName });
    return response.data;
  } catch (error) {
    console.error("Error updating category", error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<IApiResponse<ICategory>> => {
  try {
    const response = await apiService.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category", error);
    throw error;
  }
};
