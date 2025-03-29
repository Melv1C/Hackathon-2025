import axios from 'axios';
import { API_BASE_URL } from '../env';
import { CreateCapsuleType } from '../schemas/capsule';

export const capsuleApi = {
    /**
     * Create a new time capsule
     * @param capsuleData - The capsule data to create
     * @returns The created capsule data with ID
     */
    createCapsule: async (capsuleData: CreateCapsuleType) => {
        // Prepare the data for sending
        // For file content, the fileData is already in base64 format

        console.log('Creating capsule with data:', capsuleData);

        const response = await axios.post(
            `${API_BASE_URL}/capsules`,
            capsuleData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${token}`
                },
            }
        );
        return response.data;
    },

    /**
     * Get a capsule by ID
     * @param id - The capsule ID
     */
    getCapsule: async (id: string) => {
        const response = await axios.get(`${API_BASE_URL}/capsules/${id}`);
        // Handle response data which might contain base64 file content
        return response.data;
    },

    /**
     * Get all capsules for current user
     */
    getUserCapsules: async () => {
        const response = await axios.get(`${API_BASE_URL}/user/capsules`);
        return response.data;
    },

    /**
     * Delete a capsule by ID
     * @param id - The capsule ID
     */
    deleteCapsule: async (id: string) => {
        const response = await axios.delete(`${API_BASE_URL}/capsules/${id}`);
        return response.data;
    },
};
