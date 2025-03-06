// src/utils/ctrlWrapper.js

// ctrlWrapper діятиме як обгортка для контролерів у Express-додатку, для автоматичної обробки помилок, що можуть виникнути під час виконання запитів.

export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
