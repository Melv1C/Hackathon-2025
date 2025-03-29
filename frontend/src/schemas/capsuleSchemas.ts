import { z } from 'zod';

// Define a union type for capsule content
const CapsuleContentSchema = z.discriminatedUnion('contentType', [
    // Text content
    z.object({
        contentType: z.literal('text'),
        textContent: z.string().min(1, 'Content cannot be empty'),
    }),
    // File content
    z.object({
        contentType: z.literal('file'),
        fileData: z.string().min(1, 'File data cannot be empty'), // base64 encoded file
        fileName: z.string().min(1, 'Filename is required'),
        fileType: z.string().min(1, 'File type is required'),
    }),
]);

export const CreateCapsuleSchema = z.object({
    title: z.string().min(2, 'Title must have at least 2 characters'),
    description: z.string().optional(),
    content: CapsuleContentSchema,
    unlockDate: z.string().refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }, 'Unlock date must be in the future'),
    isPrivate: z.boolean().default(false),
    recipients: z.array(z.string().email('Invalid email address')).optional(),
});

// Schema for a single capsule returned from the API
export const CapsuleSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    content: CapsuleContentSchema,
    creationDate: z.string(),
    unlockDate: z.string(),
    isPrivate: z.boolean(),
    isUnlocked: z.boolean().default(true),
    ownerId: z.string(),
    recipients: z.array(z.string().email()).optional(),
});

// Compact schema for the list of user's capsules
export const UserCapsulesSchema = z.array(
    CapsuleSchema.pick({
        id: true,
        title: true,
        unlockDate: true,
        isUnlocked: true,
    })
);

export type CapsuleContent = z.infer<typeof CapsuleContentSchema>;
export type CreateCapsuleType = z.infer<typeof CreateCapsuleSchema>;
export type CapsuleType = z.infer<typeof CapsuleSchema>;
export type UserCapsulesType = z.infer<typeof UserCapsulesSchema>;
