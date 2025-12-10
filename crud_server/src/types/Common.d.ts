export interface CommonApiResponse<T = void> {
    success: boolean;
    data?: T;
    error?: string;
    statusCode?: number;
}