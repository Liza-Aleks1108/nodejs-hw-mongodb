// src/validation/resetPasswordSchema.js

import Joi from 'joi';

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
