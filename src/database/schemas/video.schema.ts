import mongoose, { Schema } from 'mongoose';

import IVideo from '@/interfaces/IVideo';

const videoSchema = new Schema<IVideo>(
    {
        _id: { type: String, required: true },
        title: { type: String, required: true },
        keywordSuggest: { type: String, required: true },
        thumbnail: { type: String, required: true },
        embed: {
            iframeUrl: { type: String, required: true },
        },
        resourceOwner: {
            type: String,
            required: true,
            ref: 'user',
        },
        category: { type: String, default: '' },
        likeCount: { type: String, default: '' },
        dislikeCount: { type: String, default: '' },
        viewCount: { type: String, default: '' },
    },
    {
        _id: false,
        timestamps: true,
        strict: true,
    },
);

export default mongoose.model<IVideo>('video', videoSchema);
