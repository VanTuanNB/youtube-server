import BlackListModel from '@/models/blackList.model';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default async function blackListMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> {
    try {
        const bearToken: string | undefined = req.headers.authorization;
        const refreshTokenPayload = bearToken && bearToken.split(' ')[1];
        if (!refreshTokenPayload)
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'TOKEN_NOT_FOUND',
            });
        const decoded: any = jwt.verify(
            refreshTokenPayload,
            process.env.JWT_TOKEN_SECRET_KEY as string,
        );
        if (!decoded)
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'TOKEN_IS_INVALID_SHOULD_BE_LOGIN',
            });
        const blackToken = await BlackListModel.filterTokenInBlackList(
            refreshTokenPayload,
        );
        if (blackToken.data) {
            const destroy = await BlackListModel.destroyRefreshTokenSuspect(
                decoded._id,
            );
            if (destroy.success)
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message:
                        'Refresh token is suspected of being blacklisted, please try login app',
                });
            return res.status(500).json(destroy);
        } else {
            next();
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}
