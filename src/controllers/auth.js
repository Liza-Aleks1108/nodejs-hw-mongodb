// src/controllers/auth.js

import createHttpError from 'http-errors';

import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  requestResetPasswordToken,
  resetPassword,
} from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

// Реєстрації нового користувача
export const registerUserController = async (req, res, next) => {
  try {
    const newUser = await registerUser(req.body);

    // Відповідь сервера, в разі успішного створення нового користувача, має бути зі статусом 201 і містити об’єкт з наступними властивостями:
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// Аутентифікації користувача
export const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    if (!session) {
      throw createHttpError(401, 'Invalid credentials');
    }

    setupSession(res, session);

    // Відповідь сервера, в разі успішного створення нового контакту, має бути зі статусом 200 і містити об’єкт з наступними властивостями:
    res.json({
      status: 200,
      message: 'User successfully logged in!',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

// Оновлення сесії на основі рефреш токена, який записаний в cookies
export const refreshSessionController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await refreshSession({ sessionId, refreshToken });

  setupSession(res, session);

  // Відповідь сервера, в разі успішного створення нового контакту, має бути зі статусом 200 і містити об’єкт з наступними властивостями:
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

// Видалення сесії на основі id сесії та токена, який записаний в cookies
export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await logoutUser(sessionId);
  }

  // Поточна сесія має бути видалена
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  // Відповідь сервера, в разі успішного логаута, має бути зі статусом 204, без тіла відповіді
  res.status(204).send();
};

// Відправляє листа для відновлення паролю на email
export const sendResetEmailController = async (req, res) => {
  await requestResetPasswordToken(req.body.email);

  // Відповідь сервера, в разі успішного надсилання листа відповідь сервера має бути зі статусом 200 та містити об’єкт з наступними властивостями:
  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

// Відновлює пароль на основі токена з відправленого листа
export const resetPasswordController = async (req, res) => {
  const { password, token } = req.body;

  await resetPassword(password, token);

  // Відповідь сервера, в разі успішно�� заміни паролю, має бути зі статусом 200 та містити об’єкт з наступними властивостями:
  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
