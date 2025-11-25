import axios from 'axios';

// Create an Axios instance
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/apis/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach latest access token
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag to avoid multiple simultaneous refreshes
let isRefreshing = false;
let failedQueue = [];

// Helper to process queued requests once token is refreshed
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Response interceptor: handles 401 errors gracefully
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const publicEndpoints = [
      '/',
  'hero-slides',
  'featured-products',
  'categories',
  'products',
  'search',
  'banners',
  'offers',
  'reviews',
  "tryon"
];

    
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      originalRequest.url?.includes(endpoint)
    );

    // If it's a public endpoint that returned 401, just continue without auth
    if (isPublicEndpoint && error.response?.status === 401) {
      console.warn('Public endpoint returned 401, continuing without auth');
      // Don't reject - return empty data or handle gracefully
      return Promise.resolve({ data: [] });
    }

    // If request already retried once, don't loop infinitely
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Only redirect to login if we're NOT on a public endpoint
      if (!refreshToken && !isPublicEndpoint) {
        console.warn("No refresh token found → redirecting to login");
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      // If no refresh token but public endpoint, just return empty data
      if (!refreshToken && isPublicEndpoint) {
        return Promise.resolve({ data: [] });
      }

      // ... rest of your token refresh logic stays the same
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/token/refresh/',
          { refresh: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAccessToken = response.data.access;
        localStorage.setItem('accessToken', newAccessToken);
        API.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        localStorage.clear();
        
        // Only redirect if not on public endpoint
        if (!isPublicEndpoint) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
// ---- API functions ---- //

// Hero slides
export const getHeroSlides = () => API.get('hero-slides/');

// Featured products
export const getFeaturedProducts = () => API.get('featured-products/');

// Categories
export const getCategories = () => API.get('categories/');

// All products (optionally filtered by category)
export const getProducts = (category) =>
  API.get('products/', { params: category ? { category } : {} });

// Product detail
export const getProductDetail = (id) => API.get(`products/${id}/`);

// Place order
export const placeOrder = (orderData) => API.post('place-order/', orderData);

// Create Stripe checkout session
export const createCheckoutSession = (orderId) => 
  API.post('create-checkout-session/', { order_id: orderId });

// Search products
export const searchProducts = (query) => API.get('search/', { params: { q: query } });

// ---- PROFILE API FUNCTIONS ---- //

// User Profile - Get profile
export const getProfile = () => API.get('profile/');

// User Profile - Update profile
export const updateProfile = (userData) => API.put('profile/', userData);

// Change password
export const changePassword = (passwordData) => API.post('change-password/', passwordData);

// ---- ORDERS API FUNCTIONS ---- //

// Get user's orders
export const getMyOrders = () => API.get('my-orders/');

// ---- ADDRESS API FUNCTIONS ---- //

// Get all addresses
export const getMyAddresses = () => API.get('my-addresses/');

// Create new address
export const addAddress = (addressData) => API.post('my-addresses/', addressData);

// Update address - NOTE: uses /addresses/ endpoint, not /my-addresses/
export const updateAddress = (addressId, addressData) => API.put(`addresses/${addressId}/`, addressData);

// Delete address - NOTE: uses /addresses/ endpoint, not /my-addresses/
export const deleteAddress = (addressId) => API.delete(`addresses/${addressId}/`);

// ---- FAVOURITES API FUNCTIONS ---- //

// Get user's favourites
export const getMyFavourites = () => API.get('my-favourites/');

// Add product to favourites
export const addToFavourites = (productId) => API.post('add-to-favourites/', { product_id: productId });

// Remove product from favourites
export const removeFromFavourites = (productId) => API.delete(`remove-from-favourites/${productId}/`);

// ---- COUPONS API FUNCTIONS ---- //

// Get available coupons
export const getMyCoupons = () => API.get('my-coupons/');

export default API;