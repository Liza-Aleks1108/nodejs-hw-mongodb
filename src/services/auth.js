import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';

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
