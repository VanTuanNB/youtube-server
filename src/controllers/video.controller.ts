import CustomRequest from '@/interfaces/customRequest';
import IVideo from '@/interfaces/IVideo';
import UserModel from '@/models/user.model';
import VideoModel from '@/models/video.model';
import { Request, Response } from 'express';

export default class VideoController {
    public static async getAll(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const videos = await VideoModel.getAll();
            return res.status(videos.code).json(videos);
        } catch (error) {
            console.log(error);
            return res.json({ error });
        }
    }

    public static async getAllVideoByUserId(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const id = req.params.id;
            if (!id)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'ID_USER_NOT_FOUND',
                });
            const videos = await VideoModel.getAllVideoByUserId(id);
            return res.status(videos.code).json(videos);
        } catch (error) {
            console.log(error);
            return res.json({ error });
        }
    }

    public static async getById(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const paramId: string = req.params.id;
            const video = await VideoModel.getById(paramId);
            return res.status(video.code).json(video);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async research(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const { key } = req.query;
            if (!key)
                return res.status(400).json({ error: 'CAN_NOT_SEARCH_VIDEO' });
            const results = await VideoModel.research(key as string);
            return res.status(results.code).json(results);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async suggest(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const { key } = req.query;
            if (!key)
                return res.status(400).json({ error: 'CAN_NOT_SUGGEST_VIDEO' });
            const suggests = await VideoModel.suggest(key as string);
            return res.status(suggests.code).json(suggests);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async create(
        req: CustomRequest,
        res: Response,
    ): Promise<Response | void> {
        try {
            const payload: Omit<IVideo, '_id' | 'resourceOwner'> = req.body;
            if (!payload)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'PAYLOAD_VIDEO_NOT_FOUND',
                });
            const currentUser: any = req.decodedToken;

            const combineUser = await UserModel.getUserById(currentUser._id);
            if (!combineUser.success)
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'PERMISSION_DENIED',
                });

            const newVideo = await VideoModel.create({
                ...payload,
                resourceOwner: combineUser.data._id,
            });
            return res.status(newVideo.code).json(newVideo);
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
            const payload: Omit<IVideo, '_id' | 'resourceOwner'> = req.body;
            if (!paramId && !payload)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'PAYLOAD_OR_ID_VIDEO_NOT_FOUND',
                });
            const updated = await VideoModel.update(paramId, {
                ...payload,
            });
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
                    message: 'DELETE_ID_VIDEO_NOT_FOUND',
                });
            const deleted = await VideoModel.delete(paramId);
            return res.status(deleted.code).json(deleted);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }
}
