import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import next from 'next';
import dbConnect from './lib/mongodb';
import handlers from './server/handlers';
import ServerStartup from './server/startup';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware
  server.use(cors());
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

  // Fallback to Next.js handler for all other routes
  server.use(async (req, res, next) => { 
    // Trigger nodemon restart
    try {
      await handle(req, res);
    } catch (err: any) {
      console.error('Next.js handle error:', err);
      res.status(500).send(err.stack || err.toString());
    }
  });

  const PORT = process.env.PORT || 3000;
  
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
