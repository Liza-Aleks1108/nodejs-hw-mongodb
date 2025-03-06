// src/middlewares/isValidId.js

// Для забезпечення коректної роботи API та захисту від можливих помилок або атак важливо перевіряти правильність ідентифікаторів, переданих у параметрах запиту. Це допомагає уникнути некоректних або шкідливих запитів, що можуть призвести до проблем з безпекою або стабільністю системи.

import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    throw createHttpError(400, 'Bad Request');
  }

  next();
};
