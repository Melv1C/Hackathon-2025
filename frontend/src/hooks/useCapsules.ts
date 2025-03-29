import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { capsuleApi } from '../api/capsuleApi';
import { CreateCapsuleType } from '../schemas/capsule';

export const useCapsules = () => {
    const queryClient = useQueryClient();

    /**
     * Hook for creating a new capsule
     * Returns mutation object with mutate function, loading and error states
     * Now supports both text and file content types
     */
    const useCreateCapsule = () => {
        return useMutation({
            mutationFn: (capsuleData: CreateCapsuleType) =>
                capsuleApi.createCapsule(capsuleData),
            onSuccess: () => {
                // Invalidate the user capsules query to refresh the list
                queryClient.invalidateQueries({ queryKey: ['userCapsules'] });
            },
        });
    };

    /**
     * Hook to fetch all capsules for the current user
     */
    const useUserCapsules = () => {
        return useQuery({
            queryKey: ['userCapsules'],
            queryFn: capsuleApi.getUserCapsules,
        });
    };

    /**
     * Hook to fetch a specific capsule by ID
     */
    const useCapsule = (capsuleId: string | undefined) => {
        return useQuery({
            queryKey: ['capsule', capsuleId],
            queryFn: () =>
                capsuleId
                    ? capsuleApi.getCapsule(capsuleId)
                    : Promise.reject('No capsule ID'),
            enabled: !!capsuleId, // Only run the query if we have a capsule ID
        });
    };

    /**
     * Hook for deleting a capsule
     */
    const useDeleteCapsule = () => {
        return useMutation({
            mutationFn: (capsuleId: string) =>
                capsuleApi.deleteCapsule(capsuleId),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['userCapsules'] });
            },
        });
    };

    return {
        useCreateCapsule,
        useUserCapsules,
        useCapsule,
        useDeleteCapsule,
    };
};
