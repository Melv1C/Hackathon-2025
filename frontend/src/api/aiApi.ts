import apiClient from './apiClient';

export const aiApi = {
    /**
     * Request AI analysis of text content
     * @param content - The text content to analyze
     * @returns The AI analysis result
     */
    analyzeContent: async (content: string) => {
        const response = await apiClient.post('/ai/analyse', { content });
        return response.data;
    },
};
