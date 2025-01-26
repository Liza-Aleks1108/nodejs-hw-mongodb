// src/middlewares/validateBody.js

import createHttpError from 'http-errors';

// middleware для перевірки body запиту
export const validateBody = (schema) => async (req, res, next) => {
  try {
    //   Важливо вказати { abortEarly: false } при виклику методу validate, щоб отримати всі можливі помилки валідації, а не першу з них
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad Request', {
      error: err.details,
    });
    next(error);
  }
};
