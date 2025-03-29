import { z } from 'zod';

// Define environment variable schema
const envSchema = z.object({
    // API base URL with fallback to localhost for development
    VITE_API_BASE_URL: z.string().default('http://localhost:3000/api'),

    // Add other environment variables as needed
    VITE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),
});

// Parse environment variables
const env = envSchema.parse({
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_ENV: import.meta.env.VITE_ENV,
});

// Export parsed variables
export const API_BASE_URL = env.VITE_API_BASE_URL;
export const NODE_ENV = env.VITE_ENV;

// For debugging in development
if (env.VITE_ENV === 'development') {
    console.log('Environment variables:', env);
}
