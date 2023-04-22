export default interface CustomResponse<T = any> {
    code: number;
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}
