// src/index.js

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { TEMP_DIR } from './constants/index.js';
import { createDirIfDoesNotExist } from './utils/createDirIfDoesNotExist.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfDoesNotExist(TEMP_DIR);
  setupServer();
};

bootstrap();

// Під час виконання дз4 було додано валідацію за допомогою Joi npm i joi

// Додаємо Cookies npm i cookie-parser
