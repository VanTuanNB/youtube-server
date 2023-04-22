import { Request, Response, Router } from 'express';
import passport from 'passport';
import AuthController from '@/controllers/auth.controller';
import verifyToken from '@/middlewares/verifyToken.middleware';
import blackListMiddleware from '@/middlewares/blackList.middleware';

const router: Router = Router();

router.get(
    '/google/login',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    }),
);
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureMessage: true,
        failureRedirect: 'http://localhost:3000/',
        session: false,
    }),
    AuthController.loginGoogle,
);

router.post('/google/logout', verifyToken, AuthController.logoutGoogle);
router.post(
    '/routingToken',
    blackListMiddleware,
    AuthController.refreshTokenRotation,
);

export default router;
