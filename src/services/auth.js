import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { SessionCollection } from '../db/models/session.js';

// Використовується для генерації випадкових байтів, які потім перетворюються на рядок для створення токенів аутентифікації, таких як accessToken і refreshToken
import { randomBytes } from 'crypto';

export const registerUser = async (payload) => {
  const newUser = await UserCollection.findOne({
    email: payload.email,
  });

  // Переконайтеся, що користувач із такою поштою ще не існує в системі, поверніть за допомогою бібілотеки createHttpError 409 помилку в іншому випадку і повідомлення 'Email in use’.
  if (newUser) {
    throw createHttpError(409, 'Email is already used');
  }

  //   Хешування паролів
  //   bcrypt - a library to help you hash passwords
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({ ...payload, password: hashedPassword });
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({
    email: payload.email,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const passwordIsEqual = await bcrypt.compare(payload.password, user.password);
  if (!passwordIsEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
  await SessionCollection.deleteOne({ userId: user._id });
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};
