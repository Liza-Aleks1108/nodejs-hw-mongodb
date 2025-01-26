// src/routers/contacts.js

import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';

// Застосуйте у файлі src/routers/contacts.js функцію ctrlWrapper
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

// Валідація та валідування тіла запиту
import {
  createContactsValidationSchema,
  updateContactsValidationSchema,
} from '../validation/contactsValidationSchema.js';

// validateBody для валідування тіла запиту
import { validateBody } from '../middlewares/validateBody.js';

// isValidId для перевірки валідності id
import { isValidId } from '../middlewares/isValidId.js';

import { authenticate } from '../middlewares/authenticate.js';

import { upload } from '../middlewares/multer.js';

// contactsRouter
const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactsValidationSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactsValidationSchema),
  ctrlWrapper(patchContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;
