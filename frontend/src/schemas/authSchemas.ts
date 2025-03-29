import { z } from 'zod';

// Schema for user registration
export const RegisterUserSchema = z
    .object({
        email: z.string().email('Please enter a valid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /[A-Z]/,
                'Password must contain at least one uppercase letter'
            )
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(
                /[^A-Za-z0-9]/,
                'Password must contain at least one special character'
            ),
        confirmPassword: z.string(),
        name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

// Schema for user login
export const LoginUserSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Schema for the User data structure
export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// Exported types
export type RegisterUserType = z.infer<typeof RegisterUserSchema>;
export type LoginUserType = z.infer<typeof LoginUserSchema>;
export type UserType = z.infer<typeof UserSchema>;

// Auth response schema
export const AuthResponseSchema = z.object({
    user: UserSchema,
    token: z.string(),
    refreshToken: z.string().optional(),
});

export type AuthResponseType = z.infer<typeof AuthResponseSchema>;
