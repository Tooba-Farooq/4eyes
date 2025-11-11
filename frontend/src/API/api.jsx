// src/api.js
import axios from 'axios';

// Create an Axios instance
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/apis/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
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

// Orders
export const getMyOrders = () => API.get('orders/my-orders/');
export const getOrderDetail = (orderId) => API.get(`orders/${orderId}/`);

// Addresses
export const getMyAddresses = () => API.get('addresses/my-addresses/');
export const addAddress = (addressData) => API.post('addresses/', addressData);
export const updateAddress = (addressId, addressData) => API.put(`addresses/${addressId}/`, addressData);
export const deleteAddress = (addressId) => API.delete(`addresses/${addressId}/`);

// Favourites
export const getMyFavourites = () => API.get('favourites/my-favourites/');
export const addToFavourites = (productId) => API.post(`favourites/${productId}/`);
export const removeFromFavourites = (productId) => API.delete(`favourites/${productId}/`);

// Coupons
export const getMyCoupons = () => API.get('coupons/my-coupons/');
export const applyCoupon = (couponCode) => API.post('coupons/apply/', { code: couponCode });

// User Profile
export const updateProfile = (userData) => API.put('users/profile/', userData);
export const changePassword = (passwordData) => API.put('users/change-password/', passwordData);


export default API;
