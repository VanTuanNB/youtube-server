import { Schema } from 'mongoose';

export default interface IVideoShort {
    _id: string;
    title: string;
    thumbnail: string;
    shortVideo: string;
    owner: string;
    likeCount?: string;
    dislikeCount?: string;
    createdAt?: Date;
    updatedAt: Date;
}
