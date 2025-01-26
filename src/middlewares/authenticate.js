// Створіть middleware authenticate, який буде на основі access токену з заголовку Authorization у вигляді Bearer-токену, визначати користувача і додавати його до обʼєкту запиту(req) у вигляді властивості user. При цьому переконайтеся, що access токен не протермінований, інакше за допомогою бібліотеки createHttpError поверніть помилку зі статусом 401 і повідомленням “Access token expired”

import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(createHttpError(401, 'Provide Authorization header'));
  }

  const [bearer, authToken] = authorization.split(' ');

  if (bearer !== 'Bearer' || !authToken) {
    return next(createHttpError(401, 'Auth header should be of Bearer type'));
  }

  const session = await SessionCollection.findOne({ accessToken: authToken });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token is expired'));
  }

  const user = await UserCollection.findById(session.userId);

  if (!user) {
    return next(createHttpError(401, 'Session not found'));
  }

  req.user = user;

  next();
};
