# Products API Integration

This document describes the integration of the Products API from `https://trantran.zenstores.com.vn/api/Products` into the React POS application.

## Overview

The integration includes:
- Environment configuration for API base URL
- Axios-based API service layer
- Redux actions and reducers for state management
- Updated ProductList component with API integration
- Error handling and loading states

## Files Created/Modified

### New Files Created:

1. **`.env`** - Environment variables
   ```
   REACT_APP_API_BASE_URL=https://trantran.zenstores.com.vn/api/
   ```

2. **`src/services/api.js`** - Main API configuration with axios
   - Base axios instance with interceptors
   - Request/response logging
   - Error handling
   - Authentication token support

3. **`src/services/productsApi.js`** - Products API service
   - getAllProducts()
   - getProductById(id)
   - createProduct(productData)
   - updateProduct(id, productData)
   - deleteProduct(id)
   - searchProducts(query)
   - getCategories()
   - getBrands()
   - Bulk operations

4. **`src/core/redux/actions/productActions.js`** - Redux actions
   - Async actions for all CRUD operations
   - Loading states management
   - Error handling

5. **`src/core/redux/reducers/productReducer.js`** - Redux reducer
   - State management for products
   - Loading and error states
   - Search functionality

6. **`src/components/ApiTest.jsx`** - API testing component
   - Test API connectivity
   - Debug API responses

### Modified Files:

1. **`src/core/redux/reducer.jsx`** - Updated to use combineReducers
   - Added new product reducer
   - Maintained backward compatibility with legacy reducer

2. **`src/feature-module/inventory/productlist.jsx`** - Enhanced with API integration
   - Fetches data from API on component mount
   - Fallback to legacy data if API fails
   - Loading states and error handling
   - Real-time search functionality
   - Delete confirmation with API calls

## Usage

### Environment Setup

1. Ensure the `.env` file is in the project root with:
   ```
   REACT_APP_API_BASE_URL=https://trantran.zenstores.com.vn/api/
   ```

2. Restart the development server after adding environment variables.

### Using the API Service

```javascript
import { productsApi } from '../services/productsApi';

// Get all products
const products = await productsApi.getAllProducts();

// Get product by ID
const product = await productsApi.getProductById(123);

// Create new product
const newProduct = await productsApi.createProduct({
  name: 'Product Name',
  price: 99.99,
  // ... other fields
});

// Update product
const updatedProduct = await productsApi.updateProduct(123, {
  name: 'Updated Name',
  price: 149.99
});

// Delete product
await productsApi.deleteProduct(123);
```

### Using Redux Actions

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, deleteProduct } from '../core/redux/actions/productActions';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);

  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Create product
  const handleCreate = async (productData) => {
    try {
      await dispatch(createProduct(productData));
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    try {
      await dispatch(deleteProduct(productId));
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

## API Endpoints

The integration supports the following endpoints:

- `GET /Products` - Get all products
- `GET /Products/{id}` - Get product by ID
- `POST /Products` - Create new product
- `PUT /Products/{id}` - Update product
- `DELETE /Products/{id}` - Delete product
- `GET /Products/search?q={query}` - Search products
- `GET /Products/categories` - Get categories
- `GET /Products/brands` - Get brands

## Error Handling

The integration includes comprehensive error handling:

1. **Network Errors** - Connection issues, timeouts
2. **HTTP Errors** - 4xx, 5xx status codes
3. **Authentication Errors** - 401 Unauthorized
4. **Validation Errors** - Invalid data format

Errors are displayed to users with retry options where appropriate.

## Testing

Use the `ApiTest` component to verify API connectivity:

```javascript
import ApiTest from './components/ApiTest';

// Add to your router or render directly
<ApiTest />
```

## Backward Compatibility

The integration maintains backward compatibility:
- Legacy Redux state structure is preserved
- Components fallback to static data if API fails
- Existing functionality continues to work

## Next Steps

1. **Authentication** - Add user authentication if required
2. **Caching** - Implement data caching for better performance
3. **Pagination** - Add pagination support for large datasets
4. **Real-time Updates** - Consider WebSocket integration for live updates
5. **Offline Support** - Add offline functionality with local storage

## Troubleshooting

### Common Issues:

1. **CORS Errors** - Ensure the API server allows requests from your domain
2. **Environment Variables** - Restart development server after changing .env
3. **Network Issues** - Check API server availability
4. **Authentication** - Verify API key/token if required

### Debug Steps:

1. Check browser console for errors
2. Use the ApiTest component to verify connectivity
3. Check Network tab in browser DevTools
4. Verify environment variables are loaded correctly

## Support

For issues related to the API integration, check:
1. Browser console for error messages
2. Network requests in DevTools
3. Redux DevTools for state changes
4. API server logs if accessible
