import CustomRequest from '@/interfaces/customRequest';
import IUser from '@/interfaces/IUser';
import UserModel from '@/models/user.model';
import { Request, Response } from 'express';

export default class UserController {
    public static async getAll(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const users = await UserModel.getAll();
            return res.status(users.code).json(users);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async getById(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const paramId: string = req.params.id;
            if (!paramId)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'USER_ID_NOT_FOUND',
                });
            const user = await UserModel.getUserById(paramId);
            return res.status(user.code).json(user);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async getUserByNickname(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const { key } = req.query;
            if (!key)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'QUERY_PARAMETER_USER_NOT_FOUND',
                });
            const user = await UserModel.getUserByNickname(key as string);
            return res.status(user.code).json(user);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async update(
        req: CustomRequest,
        res: Response,
    ): Promise<Response | void> {
        try {
            const paramId: string = req.params.id;
            const payload: Omit<IUser, '_id'> = req.body;
            if (!paramId && !payload)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'PAYLOAD_OR_ID_INVALID',
                });
            const updated = await UserModel.update(paramId, payload);
            return res.status(updated.code).json(updated);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async delete(
        req: CustomRequest,
        res: Response,
    ): Promise<Response | void> {
        try {
            const paramId: string = req.params.id;
            if (!paramId)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'DELETE_USER_FAILED',
                });
            const deleted = await UserModel.delete(paramId);
            return res.status(deleted.code).json(deleted);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }
}
