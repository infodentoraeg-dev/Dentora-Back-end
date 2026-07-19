import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import cors from 'cors';
import authRoute from './routes/Auth';
import userRoute from './routes/User';
import caseRoute from './routes/Case';
import notificationRoute from './routes/Notification';
import assignmentRoute from './routes/Assignment';
import settingsRoute from './routes/Settings';
import planRoute from './routes/Plan';
import subscriptionRoute from './routes/Subscription';
import paymentRoute from './routes/Payment';
import dashboardRoute from './routes/doctor/Dashboard';

const app = express();

// body parser
app.use(express.json());

// cors
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
    credentials: true,
  }),
);

// security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// logging (only dev)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

///////////////////

// rate limiter
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!',
// });

// app.use('/', limiter);

// static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// routes
app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/cases', caseRoute);
app.use('/notifications', notificationRoute);
app.use('/assignments', assignmentRoute);
app.use('/plans', planRoute);
app.use('/subscriptions', subscriptionRoute);
app.use('/payments', paymentRoute);
app.use('/settings', settingsRoute);
app.use('/doctor', dashboardRoute);

export default app;
