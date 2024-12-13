import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes';
import { jobRoutes } from './routes/jobRoutes';
import { reviewRoutes } from './routes/reviewRoutes';
import { messageRoutes } from './routes/messageRoutes';
import { authRoutes } from './routes/authRoutes';
import { referenceDataRoutes } from './routes/referenceDataRoutes';
import { connectDatabase } from './config/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/reference', referenceDataRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server and connect to database
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
