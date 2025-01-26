// src/controllers/auth.js

import { registerUser } from '../services/auth.js';

export const registerController = async (req, res, next) => {
  try {
    const newUser = await registerUser(req.body);

    //   Відповідь сервера, в разі успішного створення нового користувача, має бути зі статусом 201
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};
