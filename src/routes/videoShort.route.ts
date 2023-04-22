import VideoShortController from '@/controllers/videoShort.controller';
import verifyToken from '@/middlewares/verifyToken.middleware';
import { Router } from 'express';
import createShortGFS from '@/helpers/createShortGFS.helper';

const router: Router = Router();

router.get('/stream/:id', VideoShortController.getStreamShotById);

router
    .route('/:id')
    .get(VideoShortController.getById)
    .put(verifyToken, createShortGFS, VideoShortController.update)
    .delete(verifyToken, VideoShortController.delete);
router
    .route('/')
    .get(VideoShortController.getAll)
    .post(verifyToken, createShortGFS, VideoShortController.create);

export default router;
