// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';

// new import
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());

  // Enable logging for HTTP requests and responses using pino-http middleware.
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Enable CORS for cross-origin resource sharing (CORS).
  app.use(cors());

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello! Welcome to ContactsApp!',
    });
  });

  app.use(contactsRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
