import { v4 as uuidv4 } from 'uuid';

import userSchema from '@/database/schemas/user.schema';
import CustomResponse from '@/interfaces/customResponse';
import IUser from '@/interfaces/IUser';
import videoSchema from '@/database/schemas/video.schema';
export default class UserModel {
    public static async getAll(): Promise<CustomResponse> {
        try {
            const users = await userSchema.find({});
            return {
                code: 200,
                success: true,
                message: 'GET_USERS_SUCCESSFULLY',
                data: users,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'GET_USERS_FAILED',
                error,
            };
        }
    }

    public static async checkExitsUser(
        googleId: string,
    ): Promise<IUser | null> {
        try {
            const isExitUser = await userSchema.findOne({ googleId });
            return isExitUser;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    public static async getUserById(_id: string): Promise<CustomResponse> {
        try {
            const exitUser = await userSchema.findOne({ _id });
            if (!exitUser)
                return {
                    code: 410,
                    success: false,
                    message: 'USER_GET_FAILED',
                    data: exitUser,
                };
            return {
                code: 200,
                success: true,
                message: 'USER_GET_SUCCESSFULLY',
                data: exitUser,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'GET_USER_FAILED',
                error,
            };
        }
    }

    public static async getUserByNickname(
        nickname: string,
    ): Promise<CustomResponse> {
        try {
            const user = await userSchema.findOne({ nickname });
            if (!user)
                return {
                    code: 301,
                    success: false,
                    message: 'USER_NOT_FOUND',
                };
            return {
                code: 200,
                success: true,
                message: 'GET_USER_BY_NICKNAME_SUCCESSFULLY',
                data: user,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'GET_USER_BY_NICKNAME_FAILED',
                error,
            };
        }
    }

    public static async getAllUserForAdmin(): Promise<CustomResponse> {
        try {
            const users = await userSchema
                .find({})
                .$where(`this._id !== '31577180-9b66-4c26-9420-7ca8d87e62de'`);
            console.log(users);
            return {
                code: 200,
                success: true,
                message: 'GET_ALL_USER_FOR_ADMIN_SUCCESSFULLY',
                data: users,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'GET_ALL_USER_FOR_ADMIN_FAILED',
                error,
            };
        }
    }

    public static async create(
        payload: Omit<IUser, '_id'>,
    ): Promise<CustomResponse> {
        try {
            if (!payload)
                return {
                    code: 400,
                    success: false,
                    message: 'POST_USER_FAILED',
                };
            const _id: string = uuidv4();
            const createUser: IUser = await userSchema.create({
                _id,
                ...payload,
            });
            return {
                code: 201,
                success: true,
                message: 'POST_USER_SUCCESSFULLY',
                data: createUser,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 401,
                success: false,
                message: 'POST_USER_FAILED',
            };
        }
    }

    public static async update(
        _id: string,
        payload: Omit<Partial<IUser>, '_id'>,
    ): Promise<CustomResponse> {
        try {
            await userSchema.updateOne({ _id }, payload);
            return {
                code: 201,
                success: true,
                message: 'PUT_USER_SUCCESSFULLY',
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'PUT_USER_FAILED_TRY_AGAIN',
                error,
            };
        }
    }

    public static async delete(_id: string): Promise<CustomResponse> {
        try {
            const deleted = await userSchema.deleteOne({ _id });
            if (!deleted)
                return {
                    code: 500,
                    success: false,
                    message: 'DELETE_USER_FAILED',
                };
            await videoSchema.deleteMany({ resourceOwner: _id });
            return {
                code: 201,
                success: true,
                message: 'DELETE_USER_SUCCESSFULLY',
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'DELETE_USER_FAILED',
                error,
            };
        }
    }
}
