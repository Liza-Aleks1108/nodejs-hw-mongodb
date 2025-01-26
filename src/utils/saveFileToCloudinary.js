// src/utils/saveFileToCloudinary.js

// Створимо утиліту saveFileToCloudinary, яка буде отримувати файл, передавати його до cloudinary і повертати посилання на цей файл у cloudinary

import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { CLOUDINARY } from '../constants/index.js';
import fs from 'node:fs/promises';

cloudinary.config({
  secure: true,
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});
export const saveFileToCloudinary = async (file) => {
  const uploadResult = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);
  return uploadResult.secure_url;
};

// Цей код налаштовує з'єднання з Cloudinary, використовуючи параметри конфігурації, такі як ім'я хмари, API-ключ та API-секрет, які зчитуються із змінних середовища. Потім створюється асинхронна функція для збереження файлів. Ця функція приймає файл, завантажує його на сервер Cloudinary, видаляє файл із тимчасової папки і повертає безпечну URL-адресу завантаженого файлу.
