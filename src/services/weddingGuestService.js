import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);

    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/signin';
    }

    return Promise.reject(error);
  }
);

// Wedding Guest API Service
export const weddingGuestService = {
  // Get all wedding guests with pagination and filters
  async getWeddingGuests(params = {}) {
    try {
      console.log('🔍 API Call - Wedding Guests:', {
        baseURL: API_BASE_URL,
        endpoint: '/WeddingGuests',
        params: params
      });

      const response = await apiClient.get('/WeddingGuests', { params });

      console.log('✅ API Response - Wedding Guests:', {
        status: response.status,
        data: response.data
      });

      // Handle different response structures
      const responseData = response.data;

      return {
        success: true,
        data: responseData,
        message: responseData.message || 'Success'
      };
    } catch (error) {
      console.error('❌ Error fetching wedding guests:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      });

      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Failed to fetch wedding guests'
      };
    }
  },

  // Get wedding guest by ID
  async getWeddingGuestById(id) {
    try {
      const response = await apiClient.get(`/WeddingGuests/${id}`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Success'
      };
    } catch (error) {
      console.error('Error fetching wedding guest:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Failed to fetch wedding guest'
      };
    }
  },

  // Create new wedding guest
  async createWeddingGuest(guestData) {
    try {
      const response = await apiClient.post('/WeddingGuests', guestData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Wedding guest created successfully'
      };
    } catch (error) {
      console.error('Error creating wedding guest:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Failed to create wedding guest'
      };
    }
  },

  // Update wedding guest
  async updateWeddingGuest(id, guestData) {
    try {
      const response = await apiClient.put(`/WeddingGuests/${id}`, guestData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Wedding guest updated successfully'
      };
    } catch (error) {
      console.error('Error updating wedding guest:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Failed to update wedding guest'
      };
    }
  },

  // Delete wedding guest
  async deleteWeddingGuest(id) {
    try {
      const response = await apiClient.delete(`/WeddingGuests/${id}`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Wedding guest deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting wedding guest:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Failed to delete wedding guest'
      };
    }
  },

  // Update wedding guest status only
  async updateWeddingGuestStatus(id, status) {
    try {
      const response = await apiClient.put(`/WeddingGuests/${id}/status`, { status });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Status updated successfully'
      };
    } catch (error) {
      console.error('Error updating guest status:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Failed to update status'
      };
    }
  },

  // Get wedding guest statistics
  async getWeddingGuestStatistics() {
    try {
      const response = await apiClient.get('/WeddingGuests/statistics');
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Success'
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Failed to fetch statistics'
      };
    }
  },

  // Get available units for filter dropdown
  async getUnits() {
    try {
      const response = await apiClient.get('/WeddingGuests/units');
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Success'
      };
    } catch (error) {
      console.error('Error fetching units:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || error.message || 'Failed to fetch units'
      };
    }
  },

  // Export wedding guest list
  async exportWeddingGuests(format = 'excel') {
    try {
      const response = await apiClient.get('/WeddingGuests/export', {
        params: { format },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `wedding-guests.${format === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        data: null,
        message: 'Export completed successfully'
      };
    } catch (error) {
      console.error('Error exporting wedding guests:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Failed to export wedding guests'
      };
    }
  }
};

export default weddingGuestService;
