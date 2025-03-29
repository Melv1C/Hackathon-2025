import { CapsuleSchema, CreateCapsuleType, UserCapsulesSchema, UserCapsulesType } from '../schemas/capsuleSchemas';
import apiClient from './apiClient';

export const capsuleApi = {
    /**
     * Create a new time capsule
     * @param capsuleData - The capsule data to create
     * @returns The created capsule data with ID
     */
    createCapsule: async (capsuleData: CreateCapsuleType) => {
        console.log('Creating capsule with data:', capsuleData);

        const response = await apiClient.post('/capsules', capsuleData);
        return response.data;
    },

    /**
     * Get a capsule by ID
     * @param id - The capsule ID
     */
    getCapsule: async (id: string) => {
        const response = await apiClient.get(`/capsules/${id}`);
        // Handle response data which might contain base64 file content
        return CapsuleSchema.parse(response.data);
    },

    /**
     * Get all capsules for current user
     */
    getUserCapsules: async (): Promise<UserCapsulesType> => {
        const response = await apiClient.get('/capsules');
        return UserCapsulesSchema.parse(response.data);
    },

    /**
     * Delete a capsule by ID
     * @param id - The capsule ID
     */
    deleteCapsule: async (id: string) => {
        const response = await apiClient.delete(`/capsules/${id}`);
        return response.data;
    },
};
