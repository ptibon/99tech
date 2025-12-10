import { Response } from 'express';

export const handleResponse = (res: Response, status: number, data: any): void => {
    res.status(status).json(data);
};

