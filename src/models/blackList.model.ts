import { v4 as uuidv4 } from 'uuid';

import blackListSchema from '@/database/schemas/blackList.schema';
import CustomResponse from '@/interfaces/customResponse';
import IAuthTokenList from '@/interfaces/IAuthToken';

export default class AuthTokenListModel {
    public static async getByUserId(
        userId: string,
    ): Promise<IAuthTokenList | null> {
        try {
            if (!userId) return null;
            const tokenFiled = await blackListSchema.findOne({ userId });
            if (!tokenFiled) return null;
            return tokenFiled;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    public static async create(
        payload: Omit<IAuthTokenList, '_id'>,
    ): Promise<CustomResponse> {
        try {
            if (!payload)
                return {
                    code: 400,
                    success: false,
                    message: 'PAYLOAD_NOT_EXIST',
                };
            const _id: string = uuidv4();
            await blackListSchema.collection.createIndex(
                { exp: 1 },
                { expireAfterSeconds: 2592000 },
            );
            await blackListSchema.create(
                {
                    _id,
                    ...payload,
                },
                // { expireAfterSeconds: 100 },
            );

            return {
                code: 201,
                success: true,
                message: 'SUCCESSFULLY_CREATE_TOKEN',
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'CREATE_TOKEN_ERROR',
            };
        }
    }

    public static async updateStoreRefreshToken(payload: {
        userId: string;
        token: string;
        oldToken: string;
        exp: Date;
    }): Promise<CustomResponse> {
        try {
            if (!payload)
                return {
                    code: 401,
                    success: false,
                    message: 'PAYLOAD_NOT_FOUND',
                };
            const { userId, token, oldToken, exp } = payload;
            console.log(userId);
            const updated = await blackListSchema.findOneAndUpdate(
                { userId: userId },
                { token: token, exp: exp, $push: { tokenFamily: oldToken } },
            );
            console.log(updated);
            if (!updated)
                return {
                    code: 401,
                    success: false,
                    message: 'UPDATE_STORE_REFRESH_TOKEN_FAILED',
                };
            return {
                code: 201,
                success: true,
                message: 'UPDATE_STORE_REFRESH_TOKEN_SUCCESSFULLY',
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: error as string,
            };
        }
    }

    public static async filterTokenInBlackList(
        token: string,
    ): Promise<CustomResponse> {
        try {
            if (!token)
                return {
                    code: 401,
                    success: false,
                    message: 'TOKEN_NOT_FOUND',
                };
            const hasDangerToken = await blackListSchema.findOne({
                tokenFamily: { $elemMatch: { $in: [token] } },
            });
            if (!hasDangerToken)
                return {
                    code: 200,
                    success: true,
                    message: 'TOKEN_IN_BLACKLIST_NOT_FOUND',
                };
            return {
                code: 200,
                success: true,
                message: 'HAS_TOKEN_IN_BLACKLIST',
                data: hasDangerToken,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'CAN_NOT_FILTER_TOKEN',
            };
        }
    }

    public static async destroyRefreshTokenSuspect(
        userId: string,
    ): Promise<CustomResponse> {
        try {
            if (!userId)
                return {
                    code: 401,
                    success: false,
                    message: 'TOKEN_NOT_FOUND',
                };
            const destroy = await blackListSchema.findOneAndDelete({
                userId,
            });
            if (!destroy)
                return {
                    code: 500,
                    success: false,
                    message: 'CAN_NOT_DESTROY_REFRESH_TOKEN',
                };
            return {
                code: 201,
                success: true,
                message: 'DESTROY_TOKEN_SUCCESSFULLY',
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'CAN_NOT_DESTROY_REFRESH_TOKEN',
            };
        }
    }
}
