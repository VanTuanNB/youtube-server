import { v4 as uuidv4 } from 'uuid';

import CustomResponse from '@/interfaces/customResponse';
import videoShortSchema from '@/database/schemas/videoShort.schema';
import IVideoShort from '@/interfaces/IVideoShort';

export default class VideoShortModel {
    public static async getAll(): Promise<CustomResponse> {
        try {
            const shorts = await videoShortSchema.find({}).populate({
                path: 'owner',
                select: 'username nickname avatarUrl',
                strictPopulate: true,
            });
            return {
                code: 200,
                success: true,
                message: 'GET_ALL_SHORT_VIDEO_SUCCESSFULLY',
                data: shorts,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'GET_ALL_VIDEO_SHORT_FAILED',
                error,
            };
        }
    }

    public static async getAllVideoShortByUserId(
        _id: string,
    ): Promise<CustomResponse> {
        try {
            const shorts = await videoShortSchema.find({ owner: _id });
            return {
                code: 200,
                success: true,
                message: 'GET_ALL_SHORT_BY_USER_ID_SUCCESSFULLY',
                data: shorts,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'GET_ALL_SHORT_BY_USER_ID_FAILED',
                error,
            };
        }
    }

    public static async getById(id: string): Promise<CustomResponse> {
        try {
            const short: IVideoShort | null = await videoShortSchema
                .findOne({
                    _id: id,
                })
                .populate({
                    path: 'owner',
                    select: 'username nickname avatarUrl',
                    strictPopulate: true,
                });
            return {
                code: 200,
                success: true,
                message: 'GET_ID_VIDEO_SHORT_SUCCESSFULLY',
                data: short,
            };
        } catch (error) {
            return {
                code: 500,
                success: false,
                message: 'GET_ID_VIDEO_SHORT_FAILED',
                error,
            };
        }
    }

    public static async create(
        payload: Omit<IVideoShort, '_id'>,
    ): Promise<CustomResponse> {
        try {
            if (!payload)
                return {
                    code: 500,
                    success: false,
                    message: 'POST_SHORT_VIDEO_FAILED',
                };
            const _id: string = uuidv4();
            const created = await videoShortSchema.create({ _id, ...payload });
            if (!created)
                return {
                    code: 500,
                    success: false,
                    message: 'POST_SHORT_VIDEO_FAILED',
                };
            return {
                code: 201,
                success: true,
                message: 'POST_SHORT_VIDEO_SUCCESSFULLY',
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'POST_SHORT_VIDEO_FAILED',
                error,
            };
        }
    }

    public static async update(
        _id: string,
        payload: Omit<IVideoShort, '_id'>,
    ): Promise<CustomResponse> {
        try {
            const updated = await videoShortSchema.findByIdAndUpdate(
                _id,
                payload,
            );
            if (!updated)
                return {
                    code: 500,
                    success: false,
                    message: 'UPDATE_VIDEO_SHORT_FAILED',
                };
            return {
                code: 206,
                success: false,
                message: 'UPDATE_VIDEO_SHORT_SUCCESSFULLY',
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'UPDATE_VIDEO_SHORT_FAILED',
                error,
            };
        }
    }
    public static async delete(_id: string): Promise<CustomResponse> {
        try {
            const deleted = await videoShortSchema.findByIdAndDelete(_id);
            if (!deleted)
                return {
                    code: 500,
                    success: false,
                    message: 'DELETE_VIDEO_SHORT_FAILED',
                };
            return {
                code: 200,
                success: true,
                message: 'DELETE_VIDEO_SHORT_SUCCESSFULLY',
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'DELETE_VIDEO_SHORT_FAILED',
                error,
            };
        }
    }
}
