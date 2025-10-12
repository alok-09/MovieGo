import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import cinemaRoutes from './routes/cinemaRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import showtimeRoutes from './routes/showtimeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import tmdbRoutes from './routes/tmdbRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// ✅ Define allowed origins explicitly
const allowedOrigins = [
  'https://bookmyradiant.netlify.app',
  'http://localhost:5173', // for local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Cinema Booking API' });
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/tmdb', tmdbRoutes);

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message?.includes('CORS')) {
    return res.status(403).json({ message: 'CORS blocked this request' });
  }
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
