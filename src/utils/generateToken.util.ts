import IUser from '@/interfaces/IUser';
import jwt from 'jsonwebtoken';

interface IGenerateToken {
    accessToken: string;
    refreshToken: string;
}

export default function generateToken(
    payload: Express.User & Pick<IUser, '_id' | 'googleId' | 'gmail'>,
): IGenerateToken {
    const accessToken = jwt.sign(
        payload,
        process.env.JWT_TOKEN_SECRET_KEY as string,
        { expiresIn: '7days' },
    );
    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_TOKEN_SECRET_KEY as string,
        {
            expiresIn: '30days',
        },
    );
    return {
        accessToken,
        refreshToken,
    };
}
