import IAdmin from '@/interfaces/IAdmin';
import mongoose, { Schema } from 'mongoose';

const adminSchema = new Schema<IAdmin>(
    {
        _id: { type: String, required: true },
        password: { type: String, required: true },
        sshKey: { type: String, required: true },
        ref: { type: String, required: true, ref: 'user' },
    },
    {
        _id: false,
        timestamps: true,
    },
);

export default mongoose.model<IAdmin>('admin', adminSchema);
