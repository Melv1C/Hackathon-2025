import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { authApi } from '../api/authApi';
import { LoginUserType, RegisterUserType } from '../schemas/authSchemas';
import {
    authErrorAtom,
    authLoadingAtom,
    isAuthenticatedAtom,
    logoutActionAtom,
    setAuthErrorAtom,
    setUserAtom,
    userAtom,
} from '../store/userAtoms';

export function useAuth() {
    // Access atoms
    const [user] = useAtom(userAtom);
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);
    const [isLoading] = useAtom(authLoadingAtom);
    const [error] = useAtom(authErrorAtom);
    const [, setUser] = useAtom(setUserAtom);
    const [, setAuthError] = useAtom(setAuthErrorAtom);
    const [, logout] = useAtom(logoutActionAtom);

    // Access query client
    const queryClient = useQueryClient();

    // Check current user on initial load
    const {
        data: userData,
        refetch: refetchUser,
        isError: userQueryError,
    } = useQuery({
        queryKey: ['currentUser'],
        queryFn: authApi.getCurrentUser,
        enabled: false, // We'll call this manually
        retry: false,
    });

    // Handle the query results with useEffect
    useEffect(() => {
        if (userData) {
            setUser(userData);
        } else if (userQueryError) {
            setUser(null);
        }
    }, [userData, userQueryError, setUser]);

    // Initialize auth state on mount if token exists
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token && !isAuthenticated && isLoading) {
            refetchUser();
        } else if (!token) {
            setUser(null);
        }
    }, [isAuthenticated, isLoading, refetchUser, setUser]);

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: authApi.loginUser,
        onSuccess: (data) => {
            setUser(data.user);
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
        onError: (err: Error) => {
            setAuthError(
                err.message || 'Login failed. Please check your credentials.'
            );
            logout();
        },
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: authApi.registerUser,
        onSuccess: (data) => {
            setUser(data.user);
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
        onError: (err: Error) => {
            setAuthError(
                err.message || 'Registration failed. Please try again.'
            );
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: authApi.logoutUser,
        onSettled: () => {
            logout();
            queryClient.invalidateQueries();
        },
    });

    // Helper functions
    const loginUser = async (credentials: LoginUserType) => {
        return loginMutation.mutateAsync(credentials);
    };

    const registerUser = async (userData: RegisterUserType) => {
        return registerMutation.mutateAsync(userData);
    };

    const logoutUser = async () => {
        return logoutMutation.mutateAsync();
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        loginUser,
        registerUser,
        logoutUser,
        refreshUser: refetchUser,
        loginStatus: loginMutation.status,
        registerStatus: registerMutation.status,
        logoutStatus: logoutMutation.status,
    };
}
