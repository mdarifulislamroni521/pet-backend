import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import dbConnect from './lib/mongodb';
import handlers from './server/handlers';
import ServerStartup from './server/startup';

const server = express();

// Middleware
let allowedOrigins = ['http://localhost:3000'];
if (process.env.allowedOrigins) {
  try {
    allowedOrigins = JSON.parse(process.env.allowedOrigins.replace(/'/g, '"'));
  } catch (e) {
    allowedOrigins = process.env.allowedOrigins.split(',').map(s => s.trim());
  }
}

server.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

// Connect to MongoDB
dbConnect().catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Initialize and mount all converted routes
ServerStartup();
server.use(handlers.cpRoutesHandler);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3500;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}

export default server;
