import { PRODUCT_ACTIONS } from '../actions/productActions';

const initialState = {
  // Products list
  products: [],
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1,
  pageSize: 20,
  hasPrevious: false,
  hasNext: false,

  // Current product (for edit/view)
  currentProduct: null,

  // Search results
  searchResults: [],
  searchQuery: '',

  // Categories and brands
  categories: [],
  brands: [],

  // Loading states
  loading: false,
  productLoading: false,
  searchLoading: false,

  // Error states
  error: null,
  productError: null,
  searchError: null,

  // Operation states
  creating: false,
  updating: false,
  deleting: false,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Products
    case PRODUCT_ACTIONS.FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case PRODUCT_ACTIONS.FETCH_PRODUCTS_SUCCESS: {
      // Handle different API response structures
      const isArrayResponse = Array.isArray(action.payload);
      const products = isArrayResponse ? action.payload : (action.payload.data || action.payload.items || []);
      const pagination = action.payload.pagination || {};

      return {
        ...state,
        loading: false,
        products: products,
        totalProducts: pagination.totalCount || action.payload.total || products.length,
        currentPage: pagination.currentPage || action.payload.currentPage || 1,
        totalPages: pagination.totalPages || action.payload.totalPages || 1,
        pageSize: pagination.pageSize || 20,
        hasPrevious: pagination.hasPrevious || false,
        hasNext: pagination.hasNext || false,
        error: null,
      };
    }

    case PRODUCT_ACTIONS.FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Fetch Single Product
    case PRODUCT_ACTIONS.FETCH_PRODUCT_REQUEST:
      return {
        ...state,
        productLoading: true,
        productError: null,
      };

    case PRODUCT_ACTIONS.FETCH_PRODUCT_SUCCESS:
      return {
        ...state,
        productLoading: false,
        currentProduct: action.payload,
        productError: null,
      };

    case PRODUCT_ACTIONS.FETCH_PRODUCT_FAILURE:
      return {
        ...state,
        productLoading: false,
        productError: action.payload,
      };

    // Create Product
    case PRODUCT_ACTIONS.CREATE_PRODUCT_REQUEST:
      return {
        ...state,
        creating: true,
        error: null,
      };

    case PRODUCT_ACTIONS.CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        creating: false,
        products: [action.payload, ...state.products],
        totalProducts: state.totalProducts + 1,
        error: null,
      };

    case PRODUCT_ACTIONS.CREATE_PRODUCT_FAILURE:
      return {
        ...state,
        creating: false,
        error: action.payload,
      };

    // Update Product
    case PRODUCT_ACTIONS.UPDATE_PRODUCT_REQUEST:
      return {
        ...state,
        updating: true,
        error: null,
      };

    case PRODUCT_ACTIONS.UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        updating: false,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload.data : product
        ),
        currentProduct: action.payload.data,
        error: null,
      };

    case PRODUCT_ACTIONS.UPDATE_PRODUCT_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload,
      };

    // Delete Product
    case PRODUCT_ACTIONS.DELETE_PRODUCT_REQUEST:
      return {
        ...state,
        deleting: true,
        error: null,
      };

    case PRODUCT_ACTIONS.DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        deleting: false,
        products: state.products.filter(product => product.id !== action.payload),
        totalProducts: state.totalProducts - 1,
        error: null,
      };

    case PRODUCT_ACTIONS.DELETE_PRODUCT_FAILURE:
      return {
        ...state,
        deleting: false,
        error: action.payload,
      };

    // Search Products
    case PRODUCT_ACTIONS.SEARCH_PRODUCTS_REQUEST:
      return {
        ...state,
        searchLoading: true,
        searchError: null,
      };

    case PRODUCT_ACTIONS.SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        searchLoading: false,
        searchResults: action.payload.data || action.payload,
        searchQuery: action.payload.query || '',
        searchError: null,
      };

    case PRODUCT_ACTIONS.SEARCH_PRODUCTS_FAILURE:
      return {
        ...state,
        searchLoading: false,
        searchError: action.payload,
      };

    // Categories and Brands
    case PRODUCT_ACTIONS.FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
      };

    case PRODUCT_ACTIONS.FETCH_BRANDS_SUCCESS:
      return {
        ...state,
        brands: action.payload,
      };

    // Clear States
    case PRODUCT_ACTIONS.CLEAR_PRODUCT_ERROR:
      return {
        ...state,
        error: null,
        productError: null,
        searchError: null,
      };

    case PRODUCT_ACTIONS.CLEAR_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: null,
        productError: null,
      };

    default:
      return state;
  }
};

export default productReducer;
