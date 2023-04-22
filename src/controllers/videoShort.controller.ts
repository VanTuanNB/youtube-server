import { Request, Response } from 'express';
import mongoose, { mongo } from 'mongoose';

import CustomRequest from '@/interfaces/customRequest';
import VideoShortModel from '@/models/videoShort.model';
import IVideoShort from '@/interfaces/IVideoShort';

const conn = mongoose.createConnection(process.env.DATABASE_URL as string, {});
let gfs: mongoose.mongo.GridFSBucket;
conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'shorts',
        chunkSizeBytes: 31457280,
    });
});

interface ICombineMulterFileAndId extends Express.Multer.File {
    id?: mongoose.mongo.Condition<mongoose.mongo.BSON.ObjectId> | undefined;
}

export default class VideoShortController {
    public static async getAll(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const shorts = await VideoShortModel.getAll();
            return res.status(shorts.code).json(shorts);
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
            const id: string = req.params.id;
            if (!id)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'NO_PROVIDER_PARAM_ID_SHORT',
                });
            const short = await VideoShortModel.getById(id);
            return res.status(short.code).json(short);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async getStreamShotById(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const _id: any = req.params.id;
            if (!_id) return res.status(400).json({ error: 'MISSING_ID' });
            const short = await VideoShortModel.getById(_id);
            if (!short.data)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'NO_PROVIDER_SHORT_VIDEO_SCHEMA',
                });

            const fileVideoStream = await gfs
                .find({
                    _id: new mongoose.Types.ObjectId(short.data.shortVideo),
                })
                .toArray();
            const downloadStream = gfs.openDownloadStream(
                fileVideoStream[0]._id,
            );
            res.writeHead(206, {
                'Accept-Ranges': 'bytes',
                'Content-Type': fileVideoStream[0].contentType as string,
                'Content-Length': fileVideoStream[0].length as number,
            });
            downloadStream.pipe(res);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    public static async getAllShortByUserId(
        req: Request,
        res: Response,
    ): Promise<Response | void> {
        try {
            const id = req.params.id;
            if (!id)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'USER_ID_IS_NOT_FOUND',
                });
            const shorts = await VideoShortModel.getAllVideoShortByUserId(id);
            return res.status(shorts.code).json(shorts);
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
            if (!req.file)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'PAYLOAD_FILE_EMPTY',
                });
            const file: ICombineMulterFileAndId = req.file;
            const payload: Omit<IVideoShort, '_id'> = req.body;
            if (!payload.title || !payload.thumbnail)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'TITLE_OR_THUMBNAIL_NOT_FOUND',
                });
            const user: any = req.decodedToken;
            Object.assign(payload, { shortVideo: file.id, owner: user._id });
            const created = await VideoShortModel.create(payload);
            if (!created.success) return res.status(created.code).json(created);
            return res.status(created.code).json(created);
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
            const idShortSchema: string = req.params.id;
            if (!idShortSchema)
                return res.status(400).json({ error: 'NO_PROVIDER_ID_SHORT' });
            const shortSchema = await VideoShortModel.getById(idShortSchema);
            if (!shortSchema.data)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'NO_EXIST_SHORT_VIDEO',
                });
            if (!req.file)
                return res.status(500).json({ error: 'FILE_NOT_EXITS' });
            const file: ICombineMulterFileAndId = req.file;
            const payload: Omit<IVideoShort, '_id'> = req.body;

            if (!payload)
                return res.status(400).json({ error: 'PAYLOAD_NOT_FOUND' });
            await gfs.delete(
                new mongoose.mongo.BSON.ObjectId(shortSchema.data.shortVideo),
            );
            Object.assign(payload, { shortVideo: file.id });
            const updated = await VideoShortModel.update(
                idShortSchema,
                payload,
            );
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
            const idShortSchema: string = req.params.id;
            if (!idShortSchema)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'ID_SHORT_NOT_PROVIDER',
                });
            const short = await VideoShortModel.getById(idShortSchema);
            if (!short.data)
                return res.status(400).json({
                    code: 500,
                    success: false,
                    message: 'SHORT_VIDEO_NOT_EXIST',
                });
            await gfs.delete(
                new mongoose.mongo.BSON.ObjectId(short.data.shortVideo),
            );
            const deleted = await VideoShortModel.delete(short.data._id);
            return res.status(deleted.code).json(deleted);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }
}
