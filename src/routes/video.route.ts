import VideoController from '@/controllers/video.controller';
import verifyToken from '@/middlewares/verifyToken.middleware';
import { Router } from 'express';

const router: Router = Router();

router.get('/research', VideoController.research);
router.get('/suggest', VideoController.suggest);
router.get('/profile/:id', VideoController.getAllVideoByUserId);
router
    .route('/:id')
    .get(VideoController.getById)
    .put(verifyToken, VideoController.update)
    .delete(verifyToken, VideoController.delete);

router
    .route('/')
    .get(VideoController.getAll)
    .post(verifyToken, VideoController.create);

export default router;
