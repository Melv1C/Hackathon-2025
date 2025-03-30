import { CapsuleType } from '../schemas/capsuleSchemas';
import apiClient from './apiClient';

export const aiApi = {
    /**
     * Request AI analysis of text content
     * @param content - The text content to analyze
     * @returns The AI analysis result
     */
    analyzeContent: async (capsule: CapsuleType) => {
        const response = await apiClient.post('/ai/analyse', capsule, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    },
};
