import { database } from '../config/database';
import { User } from '../types/User';
import { CommonApiResponse } from '../types/Common';

export async function createUserService(input: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommonApiResponse<User>> {
    try {
        const user = await database.create(input);

        return {
            success: true,
            data: user,
            statusCode: 201
        };
    } catch (error: any) {
        if (error.message && error.message.includes('UNIQUE constraint')) {
            return {
                success: false,
                error: 'Username or email already exists',
                statusCode: 409
            };
        }

        return {
            success: false,
            error: 'Failed to create user',
            statusCode: 500
        };
    }
}

export async function getAllUserService(filters?: Partial<User>): Promise<CommonApiResponse<User[]>> {
    try {
        const users = await database.findAll(filters);

        return {
            success: true,
            data: users,
            statusCode: 200
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch users',
            statusCode: 500
        };
    }
}

export async function getUserService(id: string): Promise<CommonApiResponse<User>> {
    try {
        const user = await database.findById(id);

        if (!user) {
            return {
                success: false,
                error: 'User not found',
                statusCode: 404
            };
        }

        return {
            success: true,
            data: user,
            statusCode: 200
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch user',
            statusCode: 500
        };
    }
}

export async function updateUserService(id: string, updates: Partial<User>): Promise<CommonApiResponse<User>> {
    try {
        const updateData: Partial<User> = {};

        if (updates.username !== undefined) updateData.username = updates.username;
        if (updates.email !== undefined) updateData.email = updates.email;
        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.gender !== undefined) updateData.gender = updates.gender;
        if (updates.bio !== undefined) updateData.bio = updates.bio;

        const user = await database.update(id, updateData);

        if (!user) {
            return {
                success: false,
                error: 'User not found',
                statusCode: 404
            };
        }

        return {
            success: true,
            data: user,
            statusCode: 200
        };
    } catch (error: any) {
        if (error.message && error.message.includes('UNIQUE constraint')) {
            return {
                success: false,
                error: 'Username or email already exists',
                statusCode: 409
            };
        }

        return {
            success: false,
            error: 'Failed to update user',
            statusCode: 500
        };
    }
}

export async function deleteUserService(id: string): Promise<CommonApiResponse> {
    try {
        const deleted = await database.delete(id);

        if (!deleted) {
            return {
                success: false,
                error: 'User not found',
                statusCode: 404
            };
        }

        return {
            success: true,
            statusCode: 204
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to delete user',
            statusCode: 500
        };
    }
}

