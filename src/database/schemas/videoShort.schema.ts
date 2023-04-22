import IVideoShort from '@/interfaces/IVideoShort';
import mongoose, { Schema } from 'mongoose';

const videoShortSchema = new Schema<IVideoShort>(
    {
        _id: { type: String, required: true },
        title: { type: String, required: true },
        thumbnail: { type: String, required: true },
        shortVideo: { type: String, required: true },
        owner: { type: String, required: true, ref: 'user' },
        likeCount: { type: String, default: '' },
        dislikeCount: { type: String, default: '' },
    },
    {
        _id: false,
        timestamps: true,
    },
);

export default mongoose.model<IVideoShort>('videoShort', videoShortSchema);
