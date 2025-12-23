import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './api/index.js';
import { zodErrorHandler, errorHandler } from './middleware/error.middleware.js';

const app = express();

// 🧩 Skip express.json() kalau request upload file
app.use((req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.startsWith("multipart/form-data")) {
    return next();
  }
  express.json()(req, res, next);
});

app.use(helmet());

const allowedOrigins = ['http://localhost:5173', 'https://infolomba-fe.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running successfully!' });
});

app.use('/api', apiRoutes);

app.use(zodErrorHandler);
app.use(errorHandler);

export default app;