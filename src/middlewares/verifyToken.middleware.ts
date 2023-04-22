import CustomRequest from '@/interfaces/customRequest';
import UserModel from '@/models/user.model';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default async function verifyToken(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
): Promise<Response | void> {
    try {
        const authorization: string | undefined = req.headers.authorization;
        const token = authorization && authorization.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'INVALID_TOKEN',
            });
        const decoded: any = jwt.verify(
            token,
            process.env.JWT_TOKEN_SECRET_KEY as string,
        );
        if (!decoded)
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'TOKEN_IS_EXPIRED',
            });
        const exitUser = await UserModel.getUserById(decoded['_id']);
        if (!exitUser.success)
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'USER_PERMISSION_DENIED',
            });
        req.decodedToken = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}
