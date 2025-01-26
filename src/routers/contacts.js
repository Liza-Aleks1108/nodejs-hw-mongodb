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

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

router.post(
  '/contacts',
  validateBody(createContactsValidationSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(updateContactsValidationSchema),
  ctrlWrapper(patchContactController),
);

router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;
