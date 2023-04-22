import mongoose from 'mongoose';

export default class Database {
    public static async connect(): Promise<boolean> {
        try {
            mongoose.set('strictQuery', true);
            await mongoose.connect(process.env.DATABASE_URL as string, {});
            console.log('Connected database successfully!!!');
            return true;
        } catch (error) {
            console.log('Failed to connect to database!!!');
            return false;
        }
    }
}
