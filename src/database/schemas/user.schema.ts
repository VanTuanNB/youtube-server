import mongoose, { Schema } from 'mongoose';

import IUser from '@/interfaces/IUser';

const userSchema = new Schema<IUser>(
    {
        _id: { type: String, required: true },
        googleId: { type: String, required: true },
        username: { type: String, required: true },
        nickname: { type: String, required: true },
        gmail: { type: String, required: true },
        avatarUrl: { type: String, required: true },
        emailVerified: { type: Boolean, required: true },
        locale: { type: String, required: true },
    },
    {
        _id: false,
        timestamps: true,
        strict: true,
    },
);

export default mongoose.model<IUser>('user', userSchema);
