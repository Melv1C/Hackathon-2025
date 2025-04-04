import {
    AuthResponseType,
    LoginUserType,
    RegisterUserType,
    UserType,
} from '../schemas/authSchemas';
import apiClient from './apiClient';

export const authApi = {
    /**
     * Register a new user
     * @param userData - The user registration data
     * @returns User data and auth token
     */
    registerUser: async (
        userData: RegisterUserType
    ): Promise<AuthResponseType> => {
        const response = await apiClient.post('/auth/register', userData);

        // Store token in localStorage for future requests
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);

            if (response.data.refreshToken) {
                localStorage.setItem(
                    'refresh_token',
                    response.data.refreshToken
                );
            }
        }

        return response.data;
    },

    /**
     * Log in an existing user
     * @param credentials - User login credentials
     * @returns User data and auth token
     */
    loginUser: async (
        credentials: LoginUserType
    ): Promise<AuthResponseType> => {
        const response = await apiClient.post('/auth/login', credentials);

        // Store token in localStorage for future requests
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);

            if (response.data.refreshToken) {
                localStorage.setItem(
                    'refresh_token',
                    response.data.refreshToken
                );
            }
        }

        return response.data;
    },

    /**
     * Log out the current user
     */
    logoutUser: async (): Promise<void> => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local storage tokens
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
        }
    },

    /**
     * Get current user profile
     * @returns Current user data
     */
    getCurrentUser: async (): Promise<UserType> => {
        console.log('Fetching current user...');
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    /**
     * Refresh the authentication token
     * @returns New auth token and refresh token
     */
    refreshToken: async (): Promise<{
        token: string;
        refreshToken?: string;
    }> => {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiClient.post('/auth/refresh', {
            refreshToken,
        });

        // Store new tokens
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);

            if (response.data.refreshToken) {
                localStorage.setItem(
                    'refresh_token',
                    response.data.refreshToken
                );
            }
        }

        return response.data;
    },
};
