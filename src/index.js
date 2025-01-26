// src/index.js

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();

// Під час виконання дз4 було додано валідацію за допомогою Joi npm i joi

// Додаємо Cookies npm i cookie-parser
