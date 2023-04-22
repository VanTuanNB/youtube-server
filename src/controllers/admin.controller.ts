import adminSchema from '@/database/schemas/admin.schema';
import CustomRequest from '@/interfaces/customRequest';
import AdminModel from '@/models/admin.model';
import UserModel from '@/models/user.model';
import VideoModel from '@/models/video.model';
import { Request, Response } from 'express';

export default class AdminController {
    public static async loginAdmin(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const { gmail, password, sshKey } = req.body;
            if (!gmail || !password || !sshKey)
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'INCOMPLETE_CREDENTIALS_PROVIDED',
                });
            const authority = await AdminModel.loginAdmin({
                password,
                sshKey,
                gmail,
            });
            return res.status(authority.code).json(authority);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async createAdminByRoot(
        req: CustomRequest,
        res: Response,
    ): Promise<Response | void> {
        try {
            const { password, sshKey } = req.body;
            if (!password || !sshKey)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'PASSWORD_OR_SSH_KEY_NOT_FOUND',
                });
            const user: any = req.decodedToken;
            const created = await AdminModel.createAdmin({
                password,
                sshKey,
                ref: user._id,
            });
            return res.status(created.code).json(created);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async getAllUser(
        req: CustomRequest,
        res: Response,
    ): Promise<Response | void> {
        try {
            const users = await UserModel.getAllUserForAdmin();
            return res.status(users.code).json(users);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async deleteVideoByAdmin(
        req: CustomRequest,
        res: Response,
    ): Promise<Response | void> {
        try {
            const idVideo = req.params.id;
            if (!idVideo)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'NO_PROVIDER_ID_VIDEO',
                });
            const user: any = req.decodedToken;
            if (user._id !== '31577180-9b66-4c26-9420-7ca8d87e62de')
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'PERMISSION_DENIED',
                });
            const { sshKey } = req.body;
            if (!sshKey)
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'PERMISSION_DENIED',
                });
            const validSSHKey = await adminSchema
                .findOne({ ref: user._id })
                .where({ sshKey });
            if (!validSSHKey)
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'PERMISSION_DENIED',
                });
            const deletedVideo = await VideoModel.delete(idVideo);
            return res.status(deletedVideo.code).json(deletedVideo);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async deleteUserByAdmin(
        req: CustomRequest,
        res: Response,
    ): Promise<Response | void> {
        try {
            const idUser = req.params.id;
            if (!idUser)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'NO_PROVIDER_ID_USER',
                });
            const user: any = req.decodedToken;
            if (user._id !== '31577180-9b66-4c26-9420-7ca8d87e62de')
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'PERMISSION_DENIED',
                });
            if (idUser === '31577180-9b66-4c26-9420-7ca8d87e62de')
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'ROOT_ADMIN_CAN_NOT_DELETE',
                });
            const { sshKey } = req.body;
            if (!sshKey)
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'PERMISSION_DENIED',
                });
            const validSSHKey = await adminSchema
                .findOne({ ref: user._id })
                .where({ sshKey });
            if (!validSSHKey)
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'PERMISSION_DENIED',
                });
            const deletedUser = await UserModel.delete(idUser);
            return res.status(deletedUser.code).json(deletedUser);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }
}
