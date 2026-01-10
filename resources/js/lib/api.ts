import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, // Important for Laravel Sanctum
});

// Request interceptor to add CSRF token
api.interceptors.request.use(
    (config) => {
        // Get CSRF token from meta tag
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
            config.headers['X-CSRF-TOKEN'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling authentication errors
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login on unauthorized
            window.location.href = '/login';
        } else if (error.response?.status === 419) {
            // CSRF token mismatch - reload page to get new token
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default api;

// API response types
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    errors?: Record<string, string[]>;
}

// User types
export interface User {
    id: number;
    name: string;
    email: string;
    status: 'pending' | 'active' | 'suspended';
    guardian_id?: number;
    roles: string[];
    created_at: string;
    updated_at: string;
}

// Authentication API methods
export const authApi = {
    // Get current user
    user: (): Promise<AxiosResponse<ApiResponse<User>>> =>
        api.get('/user'),

    // Login
    login: (credentials: { email: string; password: string }): Promise<AxiosResponse<ApiResponse<User>>> =>
        api.post('/login', credentials),

    // Register Guardian
    registerGuardian: (data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }): Promise<AxiosResponse<ApiResponse<User>>> =>
        api.post('/register/guardian', data),

    // Register Therapist
    registerTherapist: (data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }): Promise<AxiosResponse<ApiResponse<User>>> =>
        api.post('/register/therapist', data),

    // Logout
    logout: (): Promise<AxiosResponse<ApiResponse>> =>
        api.post('/logout'),

    // Get CSRF cookie (required for Sanctum)
    getCsrfCookie: (): Promise<AxiosResponse> =>
        axios.get('/sanctum/csrf-cookie'),
};
