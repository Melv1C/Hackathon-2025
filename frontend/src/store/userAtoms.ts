import { atom } from 'jotai';
import { UserType } from '../schemas/authSchemas';

// Base atoms
export const userAtom = atom<UserType | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);
export const authLoadingAtom = atom<boolean>(true);
export const authErrorAtom = atom<string | null>(null);

// Derived atoms
export const isAuthenticatingAtom = atom(
    (get) => get(authLoadingAtom) && !get(isAuthenticatedAtom)
);

export const userNameAtom = atom((get) => get(userAtom)?.name || '');

export const userIdAtom = atom((get) => get(userAtom)?.id);

// Action atoms
export const setUserAtom = atom(
    null, // getter not used
    (_get, set, user: UserType | null) => {
        set(userAtom, user);
        set(isAuthenticatedAtom, !!user);
        set(authLoadingAtom, false);
        set(authErrorAtom, null);
    }
);

export const setAuthErrorAtom = atom(
    null, // getter not used
    (_get, set, error: string | null) => {
        set(authErrorAtom, error);
        set(authLoadingAtom, false);
    }
);

export const logoutActionAtom = atom(
    null, // getter not used
    (_get, set) => {
        set(userAtom, null);
        set(isAuthenticatedAtom, false);
        set(authErrorAtom, null);
        // Clean up localStorage if needed (though this is done in authApi.logoutUser)
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
    }
);
