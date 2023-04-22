import 'module-alias/register';
import { config } from 'dotenv';
config();
import express, { Express } from 'express';
import cors from 'cors';
import cookieParse from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';

import Database from '@/database/connect.db';
import rootRouter from '@/routes/index.route';
import StrategyPassport from '@/configs/passport/index.auth';

const app: Express = express();
const port = process.env.PORT_SERVER || 5000;

const originClient = [
    process.env.ORIGIN_CLIENT_DOMAIN as string,
    process.env.ORIGIN_ADMIN_DOMAIN as string,
];

// Add global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParse());
app.use(
    cors({
        origin: function (origin, callback) {
            if (originClient.indexOf(origin as string) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'HEAD', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    }),
);
app.use(morgan('dev'));
// initialize passport instance
// connect Database
Database.connect();
app.use(passport.initialize());
passport.use(StrategyPassport.strategyGoogle());
// sequentiallyPassportGoogle();

// root router
app.use('/api', rootRouter);
app.get('/login', (req, res) => {
    res.send(`
    <h1>Login App</h1>
    <a href='/api/auth/google/login'>Login With Google</a>
`);
});

app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/video.html');
});

app.listen(port, () =>
    console.log('Server listening on port http://localhost:' + port),
);
