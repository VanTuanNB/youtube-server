import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import adminSchema from '@/database/schemas/admin.schema';
import IAdmin from '@/interfaces/IAdmin';
import CustomResponse from '@/interfaces/customResponse';
import UserModel from './user.model';
import IUser from '@/interfaces/IUser';
import generateToken from '@/utils/generateToken.util';

export default class AdminModel {
    public static async loginAdmin(
        payload: Omit<IAdmin, '_id' | 'ref'> & { gmail: string },
    ): Promise<CustomResponse> {
        try {
            const rootAdmin = await adminSchema
                .findOne({ ref: '31577180-9b66-4c26-9420-7ca8d87e62de' })
                .populate({
                    path: 'ref',
                    strictPopulate: true,
                    select: 'username nickname googleId avatarUrl gmail',
                });
            const refAdmin: Pick<
                IUser,
                | '_id'
                | 'gmail'
                | 'username'
                | 'avatarUrl'
                | 'nickname'
                | 'googleId'
            > = rootAdmin?.ref as any;
            if (refAdmin.gmail !== payload.gmail.toLocaleLowerCase())
                return {
                    code: 401,
                    success: false,
                    message: 'PERMISSION_DENIED',
                };
            const rootPassword =
                (rootAdmin !== null && rootAdmin.password) || '';
            const decodedPassword = await bcrypt.compare(
                payload.password,
                rootPassword,
            );
            if (!decodedPassword)
                return {
                    code: 401,
                    success: false,
                    message: 'INCORRECT_PASSWORD',
                };
            if (payload.sshKey !== rootAdmin?.sshKey)
                return {
                    code: 401,
                    success: false,
                    message: 'PERMISSION_DENIED_SSH_KEY',
                };
            const bothToken = generateToken({
                _id: refAdmin._id,
                gmail: refAdmin.gmail,
                googleId: refAdmin.googleId,
            });

            return {
                code: 200,
                success: true,
                message: 'LOGIN_ADMIN_SYSTEM_SUCCESSFULLY',
                data: {
                    _id: refAdmin._id,
                    username: refAdmin.username,
                    nickname: refAdmin.nickname,
                    avatarUrl: refAdmin.avatarUrl,
                    gmail: refAdmin.gmail,
                    accessToken: bothToken.accessToken,
                    refreshToken: bothToken.refreshToken,
                },
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'LOGIN_ADMIN_FAILED',
                error,
            };
        }
    }

    public static async createAdmin(
        payload: Omit<IAdmin, '_id'>,
    ): Promise<CustomResponse> {
        try {
            const permissionDenied = await UserModel.getUserById(payload.ref);
            if (!permissionDenied.success)
                return {
                    code: 401,
                    success: false,
                    message: 'USER_NOT_FOUND',
                };
            if (
                permissionDenied.data._id !==
                '31577180-9b66-4c26-9420-7ca8d87e62de'
            )
                return {
                    code: 401,
                    success: false,
                    message: 'PERMISSION_DENIED',
                };
            const _id = uuidv4();
            const hashPassword = await bcrypt.hash(payload.password, 10);
            const created = await adminSchema.create({
                _id,
                ...payload,
                password: hashPassword,
            });
            return {
                code: 201,
                success: true,
                message: 'SUCCESSFULLY',
                data: created,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'CREATE_ADMIN_FAILED',
                error,
            };
        }
    }
}
