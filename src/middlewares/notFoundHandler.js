// src/middlewares/notFoundHandler.js

// notFoundHandler призначений для обробки запитів, коли клієнт звертається до неіснуючого маршруту

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
};
