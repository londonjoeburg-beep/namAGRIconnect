import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// ─── Prevent backend from dying on uncaught errors ───
process.on('uncaughtException', (err) => {
  console.error('\n🚨 UNCAUGHT EXCEPTION:', err.message);
  console.error(err.stack);
  console.error('Server stayed alive.\n');
});

process.on('unhandledRejection', (err) => {
  console.error('\n🚨 UNHANDLED REJECTION:', err);
  console.error('Server stayed alive.\n');
});

import authRouter from './routes/auth.js';
import listingsRouter from './routes/listings.js';
import commentsRouter from './routes/comments.js';
import rfqsRouter from './routes/rfqs.js';
import talkRouter from './routes/talk.js';
import soilRouter from './routes/soil.js';
import virusRouter from './routes/virus.js';
import weatherRouter from './routes/weather.js';
import ussdRouter from './routes/ussd.js';
import usersRouter from './routes/users.js';
import { errorHandler } from './middleware/error.js';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api', rateLimit({ windowMs: 60000, max: 500 }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'NamAgriConnect', ts: Date.now() }));

app.use('/api/auth', authRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/rfqs', rfqsRouter);
app.use('/api/talk', talkRouter);
app.use('/api/soil', soilRouter);
app.use('/api/virus', virusRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/ussd', ussdRouter);
app.use('/api/users', usersRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🌾 NamAgriConnect backend → http://localhost:${PORT}`));