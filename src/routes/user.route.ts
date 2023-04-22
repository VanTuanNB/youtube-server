import { Request, Router, Response } from 'express';

import verifyToken from '@/middlewares/verifyToken.middleware';
import UserController from '@/controllers/user.controller';

const router: Router = Router();

router.get('/nickname', UserController.getUserByNickname);
router
    .route('/:id')
    .get(UserController.getById)
    .put(verifyToken, UserController.update);

router.route('/').get(UserController.getAll);

export default router;
