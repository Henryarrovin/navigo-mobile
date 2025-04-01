import { IApiResponse, IProduct } from "@/app/types/types";
import apiService from "./apiService";

export const createProduct = async (productData: IProduct): Promise<IApiResponse<IProduct>> => {
  try {
    const response = await apiService.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product", error);
    throw error;
  }
};

export const getAllProducts = async (): Promise<IApiResponse<IProduct[]>> => {
  try {
    const response = await apiService.get('/products');
    return response.data;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<IApiResponse<IProduct>> => {
  try {
    const response = await apiService.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID", error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: Partial<IProduct>): Promise<IApiResponse<IProduct>> => {
  try {
    const response = await apiService.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Error updating product", error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<IApiResponse<IProduct>> => {
  try {
    const response = await apiService.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product", error);
    throw error;
  }
};
