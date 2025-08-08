import axios, { AxiosResponse, AxiosError, AxiosRequestHeaders } from 'axios';
import { CustomAxiosRequestConfig, CustomAxiosResponse } from './types';
import { TOKEN_LOCAL_STORAGE_NAME } from '@/constants/local';

// Create axios instance with default configuration
const baseClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  timeout: 20000, // Default timeout: 20 seconds
});

// Request interceptor
baseClient.interceptors.request.use((request: CustomAxiosRequestConfig) => {
  const config = request.extraConfig || {};
  request.extraConfig = config?.handlers || {};
  
  // Add authorization header if token exists
  // You can customize this based on your authentication method
  const headers = request.headers as AxiosRequestHeaders;
  if (headers && config?.hasToken) {
    const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);
    if (token) {
      headers.Authorization = `Bearer ${token}`; // Using Bearer as default token type
    }
  }

  return request;
});

// Response interceptor
baseClient.interceptors.response.use(
  (response: AxiosResponse): CustomAxiosResponse => {
    // Transform response data if needed
    return response;
  },
  (error: AxiosError) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // Example: redirect to login page
    }
    
    return Promise.reject(error);
  }
);

export default baseClient;
