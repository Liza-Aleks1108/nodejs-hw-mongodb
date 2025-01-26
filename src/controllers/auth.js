// src/controllers/auth.js

import { loginUser, registerUser } from '../services/auth.js';

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

export const loginUserController = async (req, res, next) => {
  const session = await loginUser(req.body);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.json({
    status: 200,
    message: 'User successfully logged in!',
    data: session.accessToken,
  });
};
