import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../api/aiApi';

export function useAiAnalysis() {
    const analyzeContentMutation = useMutation({
        mutationFn: (content: string) => aiApi.analyzeContent(content),
    });

    return {
        analyzeContent: analyzeContentMutation.mutate,
        isAnalyzing: analyzeContentMutation.isPending,
        analysisResult: analyzeContentMutation.data,
        analysisError: analyzeContentMutation.error,
        reset: analyzeContentMutation.reset,
    };
}
