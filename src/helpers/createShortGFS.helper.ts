import { NextFunction, Response } from 'express';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';

import CustomRequest from '@/interfaces/customRequest';

async function createShortGFS(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
) {
    const upload = await multer({
        dest: __dirname.replace('routes', 'shortVideo'),
        fileFilter(req, file, callback) {
            if (!file) return callback(new Error('PAYLOAD_EMPTY_FILE'));
            if (file.mimetype !== 'video/mp4') {
                return callback(
                    new Error('File upload must be a type of video/mp4'),
                );
            }
            callback(null, true);
        },
        storage: new GridFsStorage({
            url: process.env.DATABASE_URL as string,
            cache: true,
            file: (req: CustomRequest, file) => {
                console.log(req.file);
                console.log({ file });
                return new Promise((resolve, reject) => {
                    crypto.randomBytes(16, (err, buf) => {
                        if (err) {
                            return reject(err);
                        }
                        const filename =
                            buf.toString('hex') +
                            path.extname(file.originalname);
                        const ownerShort: any = req.decodedToken;
                        const fileInfo = {
                            filename: filename,
                            bucketName: 'shorts',
                            chunkSize: 31457280, // 30MB
                            metadata: {
                                ownerId: ownerShort._id,
                            },
                        };
                        resolve(fileInfo);
                    });
                });
            },
        }),
    }).single('file');
    return await upload(req, res, function (err) {
        if (err instanceof multer.MulterError)
            return res.status(500).json({
                message: err,
            });
        else if (err)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'FILE_UPLOAD_NOT_TYPE_VIDEO',
            });
        console.log(`file`, req.file);
        next();
    });
}

export default createShortGFS;
