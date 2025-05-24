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
import userRoute from './routes/user.routes.js';
import noteRoute from './routes/note.routes.js';

// Routes Declaration
app.use('/api/users', userRoute);
app.use('/api/notes', noteRoute);

// 404 handler for unknown API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

export { app };
