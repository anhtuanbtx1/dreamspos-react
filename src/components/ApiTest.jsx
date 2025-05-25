import React, { useState } from 'react';

const ApiTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [productId, setProductId] = useState('1'); // Default test ID

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing API connection to:', process.env.REACT_APP_API_BASE_URL);

      // Test with fetch first to get more detailed error info
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}Products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      console.log('API Response:', data);
    } catch (err) {
      console.error('API Error Details:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
        cause: err.cause
      });

      let errorMessage = err.message || 'Failed to connect to API';

      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        errorMessage = 'CORS Error: API server may not allow requests from this domain, or server is unreachable';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testProductDetail = async () => {
    if (!productId) {
      setError('Please enter a product ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing Product Detail API for ID:', productId);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}Products/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      console.log('Product Detail Response:', data);
    } catch (err) {
      console.error('Product Detail API Error:', err);

      let errorMessage = err.message || 'Failed to fetch product details';

      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        errorMessage = 'CORS Error or Network issue';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5>API Connection Test</h5>
        </div>
        <div className="card-body">
          <p><strong>API Base URL:</strong> {process.env.REACT_APP_API_BASE_URL}</p>

          <div className="row">
            <div className="col-md-6">
              <h6>Test All Products API</h6>
              <button
                className="btn btn-primary"
                onClick={testApiConnection}
                disabled={loading}
              >
                {loading ? 'Testing...' : 'Test Products List API'}
              </button>
            </div>

            <div className="col-md-6">
              <h6>Test Product Detail API</h6>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Product ID"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  onClick={testProductDetail}
                  disabled={loading || !productId}
                >
                  {loading ? 'Testing...' : 'Test Product Detail'}
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="mt-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-3">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="alert alert-success mt-3">
              <strong>Success!</strong> API connection working.
              <details className="mt-2">
                <summary>Response Data</summary>
                <pre className="mt-2" style={{ fontSize: '12px', maxHeight: '300px', overflow: 'auto' }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
