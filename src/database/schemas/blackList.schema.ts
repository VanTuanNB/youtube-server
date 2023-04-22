import mongoose, { Schema } from 'mongoose';

import IBlackList from '@/interfaces/IAuthToken';

const blackListSchema = new Schema<IBlackList>(
    {
        _id: { type: String, require: true },
        userId: { type: String, required: true, ref: 'user' },
        token: { type: String, required: true },
        tokenFamily: [{ type: String, default: '' }],
        exp: { type: Date, default: Date.now },
    },
    {
        _id: false,
    },
);

export default mongoose.model<IBlackList>('blackList', blackListSchema);
