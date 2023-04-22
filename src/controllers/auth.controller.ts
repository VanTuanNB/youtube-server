import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import CustomRequest from '@/interfaces/customRequest';
import IUser from '@/interfaces/IUser';
import generateToken from '@/utils/generateToken.util';
import BlackListModel from '@/models/blackList.model';

export default class AuthController {
    public static async loginAdmin(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const { email, password, sshKey } = req.body;
            if (!email || password || sshKey)
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'Not enough information to authenticate',
                });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async loginGoogle(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const payload: (Express.User & Partial<IUser>) | undefined =
                req.user;
            const bothToken = generateToken({
                _id: payload?._id ?? '',
                googleId: payload?.googleId ?? '',
                gmail: payload?.gmail ?? '',
            });
            const createRefreshTokenStore = await BlackListModel.create({
                userId: payload?._id ?? '',
                token: bothToken.refreshToken,
            });
            if (!createRefreshTokenStore.success)
                return res.status(500).json({
                    code: 500,
                    success: false,
                    message: 'FAILED_TO_LOGIN',
                });

            res.cookie(
                'login',
                JSON.stringify({
                    sub: payload?._id,
                    accessToken: bothToken.accessToken,
                    refreshToken: bothToken.refreshToken,
                }),
                { maxAge: 60 * 60 * 24 * 30 * 1000 },
            );
            return res.status(201).redirect('http://localhost:3000');
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error });
        }
    }

    public static async logoutGoogle(
        req: CustomRequest,
        res: Response,
    ): Promise<Response | void> {
        try {
            const user: any = req.decodedToken;
            const logout = await BlackListModel.destroyRefreshTokenSuspect(
                user._id,
            );
            // if (!logout.success)
            //     return res.status(500).json({
            //         code: 500,
            //         message: 'FAILED_TO_LOGOUT',
            //     });
            req.isAuthenticated = () => false;
            req.user = {};
            req.decodedToken = null;
            res.clearCookie('login');
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'LOGOUT_SUCCESSFULLY',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async refreshTokenRotation(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const bearToken = req.headers.authorization;
            const refreshTokenOld: string | undefined =
                bearToken && bearToken.split(' ')[1];
            if (!refreshTokenOld)
                return res.status(302).json({
                    code: 302,
                    success: false,
                    message: 'NO_EXIT_REFRESH_TOKEN',
                });
            const isVerify = jwt.verify(
                refreshTokenOld,
                process.env.JWT_TOKEN_SECRET_KEY as string,
            );
            if (!isVerify)
                return res.status(401).json({
                    code: 302,
                    success: false,
                    message: 'REFRESH_TOKEN_IS_INVALID',
                });
            const decodedOldToken: any = jwt.decode(refreshTokenOld, {
                json: true,
                complete: true,
            });
            const bothToken = generateToken({
                _id: decodedOldToken.payload.id,
                googleId: decodedOldToken.payload.googleId,
                gmail: decodedOldToken.payload.gmail,
            });
            const updated = await BlackListModel.updateStoreRefreshToken({
                userId: decodedOldToken.payload._id,
                token: bothToken.refreshToken,
                oldToken: refreshTokenOld,
                exp: new Date(),
            });
            if (!updated.success)
                return res.status(500).json({
                    code: 500,
                    success: false,
                    message: 'CAN_NOT_UPDATE',
                });
            return res.json({
                accessToken: bothToken.accessToken,
                refreshToken: bothToken.refreshToken,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }
}
