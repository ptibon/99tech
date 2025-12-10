import { z } from 'zod';

export const createUserSchema = z.object({
    username: z.string({ required_error: 'Username is required' }).min(1, 'Username is required'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email format').min(1, 'Email is required'),
    name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
    gender: z.string().optional(),
    bio: z.string().optional()
});

export const updateUserSchema = z.object({
    username: z.string().min(1, 'Username is required').optional(),
    email: z.string().email('Invalid email format').min(1, 'Email is required').optional(),
    name: z.string().min(1, 'Name is required').optional(),
    gender: z.string().optional(),
    bio: z.string().optional()
});

export const getUserSchema = z.object({
    id: z.string().uuid('Invalid user ID format')
});

export const deleteUserSchema = z.object({
    id: z.string().uuid('Invalid user ID format')
});

export type CreateUserValidation = z.infer<typeof createUserSchema>;
export type UpdateUserValidation = z.infer<typeof updateUserSchema>;

