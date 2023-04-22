import { v4 as uuidv4 } from 'uuid';

import CustomResponse from '@/interfaces/customResponse';
import videoSchema from '@/database/schemas/video.schema';
import IVideo from '@/interfaces/IVideo';

export default class VideoModel {
    public static async getAll(): Promise<CustomResponse> {
        try {
            const videos = await videoSchema
                .find({})
                .populate({
                    path: 'resourceOwner',
                    select: 'username nickname avatarUrl -_id',
                    strictPopulate: true,
                })
                .select('title thumbnail resourceOwner viewCount updatedAt');
            return {
                code: 200,
                success: true,
                message: 'GET_VIDEOS_SUCCESSFULLY',
                data: videos,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'GET_ALL_VIDEO_FAILED',
                error,
            };
        }
    }

    public static async getAllVideoByUserId(
        _id: string,
    ): Promise<CustomResponse> {
        try {
            const videos = await videoSchema
                .find({ resourceOwner: _id })
                .populate({
                    path: 'resourceOwner',
                    select: 'username nickname avatarUrl -_id',
                    strictPopulate: true,
                })
                .select('title thumbnail resourceOwner viewCount updatedAt');
            return {
                code: 200,
                success: true,
                message: 'GET_ALL_VIDEO_BY_USER_ID_SUCCESSFULLY',
                data: videos,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'GET_ALL_VIDEO_BY_USER_ID_FAILED',
                error,
            };
        }
    }

    public static async getById(_id: string): Promise<CustomResponse> {
        try {
            const video = await videoSchema.findById({ _id }).populate({
                path: 'resourceOwner',
                select: 'username nickname avatarUrl',
                strictPopulate: true,
            });
            if (!video)
                return {
                    code: 400,
                    success: false,
                    message: 'GET_VIDEO_FAILED_TRY_AGAIN',
                    data: video,
                };
            return {
                code: 200,
                success: true,
                message: 'GET_VIDEO_SUCCESSFULLY',
                data: video,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'GET_VIDEO_FAILED_TRY_AGAIN',
                error,
            };
        }
    }

    public static async research(keyword: string): Promise<CustomResponse> {
        const keywordToFind = keyword.replace('(cover)', '');
        try {
            const results = await videoSchema
                .find({
                    $or: [
                        { title: { $regex: keywordToFind, $options: 'i' } },
                        {
                            keywordSuggest: {
                                $regex: keywordToFind,
                                $options: 'i',
                            },
                        },
                    ],
                })
                .populate({
                    path: 'resourceOwner',
                    select: 'username nickname avatarUrl -_id',
                    strictPopulate: true,
                })
                .select('title thumbnail resourceOwner viewCount updatedAt');
            return {
                code: 200,
                success: true,
                message: 'GET_RESEARCH_VIDEO_SUCCESSFULLY',
                data: results,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'GET_RESEARCH_VIDEO_FAILED',
                error,
            };
        }
    }

    public static async suggest(keyword: string): Promise<CustomResponse> {
        try {
            const suggests = await videoSchema
                .find({
                    $or: [
                        { keywordSuggest: { $regex: keyword, $options: 'i' } },
                    ],
                })
                .select('keywordSuggest');
            return {
                code: 200,
                success: true,
                message: 'GET_SUGGEST_VIDEO_SUCCESSFULLY',
                data: suggests,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'GET_SUGGEST_VIDEO_FAILED',
                error,
            };
        }
    }

    public static async create(
        payload: Omit<IVideo, '_id' | 'keywordSuggest'>,
    ): Promise<CustomResponse> {
        try {
            if (!payload)
                return {
                    code: 400,
                    success: false,
                    message: 'POST_PAYLOAD_NOT_FOUND',
                };
            const _id: string = uuidv4();
            const filterString: string = payload.title
                .split('|')[0]
                .normalize('NFD')
                .toLocaleLowerCase()
                .trim();
            const dedicationCharacter = filterString.replace(
                /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
                '',
            );
            const keywordSuggest = dedicationCharacter.replace(/\s{2,}/g, ' ');
            const create = await videoSchema.create({
                _id,
                keywordSuggest,
                ...payload,
            });
            return {
                code: 201,
                success: true,
                message: 'POST_VIDEO_SUCCESSFULLY',
                data: create,
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'POST_VIDEO_FAILED',
                error,
            };
        }
    }

    public static async update(
        _id: string,
        payload: Omit<IVideo, '_id' | 'resourceOwner'>,
    ): Promise<CustomResponse> {
        try {
            if (!_id && !payload)
                return {
                    code: 400,
                    success: false,
                    message: 'PAYLOAD_OR_ID_VIDEO_NOT_FOUND',
                };
            const filterString: string = payload.title
                .split('|')[0]
                .normalize('NFD')
                .toLocaleLowerCase()
                .trim();
            const dedicationCharacter = filterString.replace(
                /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
                '',
            );
            const keywordSuggest = dedicationCharacter.replace(/\s{2,}/g, ' ');
            Object.assign(payload, { keywordSuggest });
            await videoSchema.updateOne({ _id }, payload);
            return {
                code: 201,
                success: true,
                message: 'PUT_VIDEO_SUCCESSFULLY',
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'PUT_VIDEO_FAILED',
                error,
            };
        }
    }

    public static async delete(_id: string): Promise<CustomResponse> {
        try {
            await videoSchema.findByIdAndDelete({ _id });
            return {
                code: 201,
                success: true,
                message: 'DELETE_VIDEO_SUCCESSFULLY',
            };
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'DELETE_VIDEO_FAILED_TRY_AGAIN',
                error,
            };
        }
    }
}
