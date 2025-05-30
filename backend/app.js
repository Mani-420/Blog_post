import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// CORS Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // or your frontend URL
    credentials: true,
    optionsSuccessStatus: 200
  })
);

// Other Middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));
app.use(cookieParser());

// Routes Import
import userRoute from './routes/user.route.js';
import blogRoute from './routes/blogs.route.js';
import commentRoute from './routes/comments.route.js';
import reviewRoute from './routes/reviews.route.js';

// Routes Declaration
app.use('/api/v1/users', userRoute);
app.use('/api/v1/blogs', blogRoute);
app.use('/api/v1/comments', commentRoute);
app.use('/api/v1/reviews', reviewRoute);

// 404 handler for unknown API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

export { app };
