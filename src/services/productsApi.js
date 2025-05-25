import api from './api';

// Products API endpoints
const ENDPOINTS = {
  PRODUCTS: 'Products',
  PRODUCT_BY_ID: (id) => `Products/${id}`,
  CATEGORIES: 'Products/categories',
  BRANDS: 'Products/brands',
  SEARCH: 'Products/search',
};

// Products API service
export const productsApi = {
  // Get all products
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINTS.PRODUCTS, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.PRODUCT_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await api.post(ENDPOINTS.PRODUCTS, productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(ENDPOINTS.PRODUCT_BY_ID(id), productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(ENDPOINTS.PRODUCT_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    try {
      const response = await api.get(ENDPOINTS.SEARCH, {
        params: { q: query, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Get product categories
  getCategories: async () => {
    try {
      const response = await api.get(ENDPOINTS.CATEGORIES);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get product brands
  getBrands: async () => {
    try {
      const response = await api.get(ENDPOINTS.BRANDS);
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },

  // Bulk operations
  bulkUpdateProducts: async (products) => {
    try {
      const response = await api.put(`${ENDPOINTS.PRODUCTS}/bulk`, { products });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating products:', error);
      throw error;
    }
  },

  bulkDeleteProducts: async (productIds) => {
    try {
      const response = await api.delete(`${ENDPOINTS.PRODUCTS}/bulk`, {
        data: { ids: productIds }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      throw error;
    }
  },
};

export default productsApi;
