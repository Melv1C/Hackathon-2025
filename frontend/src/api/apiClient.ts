import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_BASE_URL } from '../env';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to attach token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // If error is 401 Unauthorized and we haven't tried to refresh the token yet
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest.headers['x-retry']
        ) {
            try {
                // Get refresh token
                const refreshToken = localStorage.getItem('refresh_token');

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Try to get a new token
                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {
                        refreshToken,
                    }
                );

                // Store new tokens
                if (response.data.token) {
                    localStorage.setItem('auth_token', response.data.token);

                    if (response.data.refreshToken) {
                        localStorage.setItem(
                            'refresh_token',
                            response.data.refreshToken
                        );
                    }

                    // Update the failed request with new token and retry
                    originalRequest.headers[
                        'Authorization'
                    ] = `Bearer ${response.data.token}`;
                    originalRequest.headers['x-retry'] = 'true';

                    // Retry the original request
                    return apiClient(originalRequest);
                }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (refreshError) {
                // If refresh fails, log out the user
                localStorage.removeItem('auth_token');
                localStorage.removeItem('refresh_token');
                // Redirect to login or handle as needed
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
