import { Strategy } from 'passport-google-oauth20';

import IUser from '@/interfaces/IUser';
import UserModel from '@/models/user.model';

export default class StrategyPassport {
    public static strategyGoogle(): Strategy {
        const strategy = new Strategy(
            {
                clientID: process.env.CLIENT_ID_GOOGLE as string,
                clientSecret: process.env.CLIENT_SECRET_GOOGLE as string,
                callbackURL: process.env.CALLBACK_URL_GOOGLE as string,
                scope: ['profile', 'email'],
            },
            async function verify(accessToken, refreshToken, user, callback) {
                try {
                    const payload: Omit<IUser, '_id'> = {
                        googleId: user._json.sub,
                        username: user._json.name ?? '',
                        gmail: user._json.email ?? '',
                        avatarUrl: user._json.picture ?? '',
                        emailVerified: !!user._json.email_verified,
                        locale: user._json.locale ?? '',
                        nickname:
                            user._json.given_name
                                ?.concat(user._json.family_name ?? '')
                                .normalize('NFD')
                                .replace(/[^a-z0-9\s]/gi, '')
                                .toLocaleLowerCase()
                                .replace(/\s+/g, '') ?? '',
                    };
                    const exitUser = await UserModel.checkExitsUser(
                        payload.googleId,
                    );
                    if (exitUser) return callback(null, exitUser);
                    const createUser = await UserModel.create(payload);
                    return callback(null, createUser.data);
                } catch (error) {
                    console.log(error);
                    return callback(null);
                }
            },
        );
        return strategy;
    }
}
