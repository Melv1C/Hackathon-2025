import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../api/aiApi';
import { CapsuleType } from '../schemas/capsuleSchemas';

export function useAiAnalysis() {
    const analyzeContentMutation = useMutation({
        mutationFn: (capsule: CapsuleType) => aiApi.analyzeContent(capsule),
    });

    return {
        analyzeContent: analyzeContentMutation.mutate,
        isAnalyzing: analyzeContentMutation.isPending,
        analysisResult: analyzeContentMutation.data,
        analysisError: analyzeContentMutation.error,
        reset: analyzeContentMutation.reset,
    };
}
