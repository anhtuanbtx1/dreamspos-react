import { productsApi } from '../../../services/productsApi';

// Action Types
export const PRODUCT_ACTIONS = {
  // Fetch Products
  FETCH_PRODUCTS_REQUEST: 'FETCH_PRODUCTS_REQUEST',
  FETCH_PRODUCTS_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  FETCH_PRODUCTS_FAILURE: 'FETCH_PRODUCTS_FAILURE',

  // Fetch Single Product
  FETCH_PRODUCT_REQUEST: 'FETCH_PRODUCT_REQUEST',
  FETCH_PRODUCT_SUCCESS: 'FETCH_PRODUCT_SUCCESS',
  FETCH_PRODUCT_FAILURE: 'FETCH_PRODUCT_FAILURE',

  // Create Product
  CREATE_PRODUCT_REQUEST: 'CREATE_PRODUCT_REQUEST',
  CREATE_PRODUCT_SUCCESS: 'CREATE_PRODUCT_SUCCESS',
  CREATE_PRODUCT_FAILURE: 'CREATE_PRODUCT_FAILURE',

  // Update Product
  UPDATE_PRODUCT_REQUEST: 'UPDATE_PRODUCT_REQUEST',
  UPDATE_PRODUCT_SUCCESS: 'UPDATE_PRODUCT_SUCCESS',
  UPDATE_PRODUCT_FAILURE: 'UPDATE_PRODUCT_FAILURE',

  // Delete Product
  DELETE_PRODUCT_REQUEST: 'DELETE_PRODUCT_REQUEST',
  DELETE_PRODUCT_SUCCESS: 'DELETE_PRODUCT_SUCCESS',
  DELETE_PRODUCT_FAILURE: 'DELETE_PRODUCT_FAILURE',

  // Search Products
  SEARCH_PRODUCTS_REQUEST: 'SEARCH_PRODUCTS_REQUEST',
  SEARCH_PRODUCTS_SUCCESS: 'SEARCH_PRODUCTS_SUCCESS',
  SEARCH_PRODUCTS_FAILURE: 'SEARCH_PRODUCTS_FAILURE',

  // Categories and Brands
  FETCH_CATEGORIES_SUCCESS: 'FETCH_CATEGORIES_SUCCESS',
  FETCH_BRANDS_SUCCESS: 'FETCH_BRANDS_SUCCESS',

  // Clear States
  CLEAR_PRODUCT_ERROR: 'CLEAR_PRODUCT_ERROR',
  CLEAR_CURRENT_PRODUCT: 'CLEAR_CURRENT_PRODUCT',
};

// Action Creators

// Fetch all products
export const fetchProducts = (params = {}) => async (dispatch) => {
  dispatch({ type: PRODUCT_ACTIONS.FETCH_PRODUCTS_REQUEST });

  try {
    const data = await productsApi.getAllProducts(params);
    dispatch({
      type: PRODUCT_ACTIONS.FETCH_PRODUCTS_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: PRODUCT_ACTIONS.FETCH_PRODUCTS_FAILURE,
      payload: error.response?.data?.message || error.message || 'Failed to fetch products',
    });
    throw error;
  }
};

// Fetch single product
export const fetchProduct = (id) => async (dispatch) => {
  dispatch({ type: PRODUCT_ACTIONS.FETCH_PRODUCT_REQUEST });

  try {
    const data = await productsApi.getProductById(id);
    dispatch({
      type: PRODUCT_ACTIONS.FETCH_PRODUCT_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: PRODUCT_ACTIONS.FETCH_PRODUCT_FAILURE,
      payload: error.response?.data?.message || error.message || 'Failed to fetch product',
    });
    throw error;
  }
};

// Create product
export const createProduct = (productData) => async (dispatch) => {
  dispatch({ type: PRODUCT_ACTIONS.CREATE_PRODUCT_REQUEST });

  try {
    const data = await productsApi.createProduct(productData);
    dispatch({
      type: PRODUCT_ACTIONS.CREATE_PRODUCT_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: PRODUCT_ACTIONS.CREATE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || error.message || 'Failed to create product',
    });
    throw error;
  }
};

// Update product
export const updateProduct = (id, productData) => async (dispatch) => {
  dispatch({ type: PRODUCT_ACTIONS.UPDATE_PRODUCT_REQUEST });

  try {
    const data = await productsApi.updateProduct(id, productData);
    dispatch({
      type: PRODUCT_ACTIONS.UPDATE_PRODUCT_SUCCESS,
      payload: { id, data },
    });
    return data;
  } catch (error) {
    dispatch({
      type: PRODUCT_ACTIONS.UPDATE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || error.message || 'Failed to update product',
    });
    throw error;
  }
};

// Delete product
export const deleteProduct = (id) => async (dispatch) => {
  dispatch({ type: PRODUCT_ACTIONS.DELETE_PRODUCT_REQUEST });

  try {
    await productsApi.deleteProduct(id);
    dispatch({
      type: PRODUCT_ACTIONS.DELETE_PRODUCT_SUCCESS,
      payload: id,
    });
    return id;
  } catch (error) {
    dispatch({
      type: PRODUCT_ACTIONS.DELETE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || error.message || 'Failed to delete product',
    });
    throw error;
  }
};

// Search products
export const searchProducts = (query, params = {}) => async (dispatch) => {
  dispatch({ type: PRODUCT_ACTIONS.SEARCH_PRODUCTS_REQUEST });

  try {
    const data = await productsApi.searchProducts(query, params);
    dispatch({
      type: PRODUCT_ACTIONS.SEARCH_PRODUCTS_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: PRODUCT_ACTIONS.SEARCH_PRODUCTS_FAILURE,
      payload: error.response?.data?.message || error.message || 'Failed to search products',
    });
    throw error;
  }
};

// Fetch categories
export const fetchCategories = () => async (dispatch) => {
  try {
    const data = await productsApi.getCategories();
    dispatch({
      type: PRODUCT_ACTIONS.FETCH_CATEGORIES_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};

// Fetch brands
export const fetchBrands = () => async (dispatch) => {
  try {
    const data = await productsApi.getBrands();
    dispatch({
      type: PRODUCT_ACTIONS.FETCH_BRANDS_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    throw error;
  }
};

// Clear error
export const clearProductError = () => ({
  type: PRODUCT_ACTIONS.CLEAR_PRODUCT_ERROR,
});

// Clear current product
export const clearCurrentProduct = () => ({
  type: PRODUCT_ACTIONS.CLEAR_CURRENT_PRODUCT,
});
