// src/utils/createDirIfDoesNotExist.js

// Створимо утиліту createDirIfNotExists, яка буде перевіряти, чи існує директорія за вказаним шляхом (url). Якщо директорія не існує, то функція створить її
import fs from 'node:fs/promises';

export const createDirIfDoesNotExist = async (url) => {
  try {
    await fs.access(url);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
};
