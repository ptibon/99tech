import { Request, Response } from 'express';
import {
    createUserService,
    getAllUserService,
    getUserService,
    updateUserService,
    deleteUserService
} from '../services/user.service';
import { handleResponse } from '../utils/response';
import {
    createUserSchema,
    updateUserSchema,
    getUserSchema,
    deleteUserSchema
} from '../validations/user.validation';
import { User } from '../types/User';

export const createUserController = async (req: Request, res: Response): Promise<void> => {
    const validationResult = createUserSchema.safeParse(req.body);

    if (!validationResult.success) {
        const errorMessage = validationResult.error.errors.map(e => e.message).join(', ');
        handleResponse(res, 400, { error: errorMessage });
        return;
    }

    const result = await createUserService(validationResult.data);

    if (!result.success) {
        handleResponse(res, result.statusCode || 500, { error: result.error });
        return;
    }

    handleResponse(res, result.statusCode || 201, result.data);
};

export const getAllUsersController = async (req: Request, res: Response): Promise<void> => {
    const filters: Partial<User> = {};

    if (req.query.username) {
        filters.username = req.query.username as string;
    }

    if (req.query.email) {
        filters.email = req.query.email as string;
    }

    if (req.query.name) {
        filters.name = req.query.name as string;
    }

    if (req.query.gender) {
        filters.gender = req.query.gender as string;
    }

    const result = await getAllUserService(filters);

    if (!result.success) {
        handleResponse(res, result.statusCode || 500, { error: result.error });
        return;
    }

    handleResponse(res, result.statusCode || 200, result.data);
};

export const getUserController = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const validationResult = getUserSchema.safeParse({ id });

    if (!validationResult.success) {
        const errorMessage = validationResult.error.errors.map(e => e.message).join(', ');
        handleResponse(res, 400, { error: errorMessage });
        return;
    }

    const result = await getUserService(id);

    if (!result.success) {
        handleResponse(res, result.statusCode || 500, { error: result.error });
        return;
    }

    handleResponse(res, result.statusCode || 200, result.data);
};

export const updateUserController = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const idValidationResult = getUserSchema.safeParse({ id });
    if (!idValidationResult.success) {
        const errorMessage = idValidationResult.error.errors.map(e => e.message).join(', ');
        handleResponse(res, 400, { error: errorMessage });
        return;
    }

    const bodyValidationResult = updateUserSchema.safeParse(req.body);
    if (!bodyValidationResult.success) {
        const errorMessage = bodyValidationResult.error.errors.map(e => e.message).join(', ');
        handleResponse(res, 400, { error: errorMessage });
        return;
    }

    const result = await updateUserService(id, bodyValidationResult.data);

    if (!result.success) {
        handleResponse(res, result.statusCode || 500, { error: result.error });
        return;
    }

    handleResponse(res, result.statusCode || 200, result.data);
};

export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const validationResult = deleteUserSchema.safeParse({ id });

    if (!validationResult.success) {
        const errorMessage = validationResult.error.errors.map(e => e.message).join(', ');
        handleResponse(res, 400, { error: errorMessage });
        return;
    }

    const result = await deleteUserService(id);

    if (!result.success) {
        handleResponse(res, result.statusCode || 500, { error: result.error });
        return;
    }

    res.status(result.statusCode || 204).send();
};

