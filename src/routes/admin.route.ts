import AdminController from '@/controllers/admin.controller';
import VideoController from '@/controllers/video.controller';
import verifyToken from '@/middlewares/verifyToken.middleware';
import { Router } from 'express';

const router = Router();
router.get('/management/user', verifyToken, AdminController.getAllUser);
router.get('/management/video', verifyToken, VideoController.getAll);
router.delete(
    '/destroy/video/:id',
    verifyToken,
    AdminController.deleteVideoByAdmin,
);

router.delete(
    '/destroy/user/:id',
    verifyToken,
    AdminController.deleteUserByAdmin,
);
router.post('/auth/login', AdminController.loginAdmin);
router.post('/', verifyToken, AdminController.createAdminByRoot);

export default router;
