import { Router } from 'express';

import authGoogleRouter from './authGoogle.route';
import userRouter from './user.route';
import videoRouter from './video.route';
import videoShortRouter from './videoShort.route';
import adminRouter from './admin.route';

const rootRouter: Router = Router();
rootRouter.use('/admin', adminRouter);
rootRouter.use('/auth', authGoogleRouter);
rootRouter.use('/user', userRouter);
rootRouter.use('/video', videoRouter);
rootRouter.use('/short', videoShortRouter);
rootRouter.use('/', (req, res) => res.send('Welcome to server app-music!'));

export default rootRouter;
