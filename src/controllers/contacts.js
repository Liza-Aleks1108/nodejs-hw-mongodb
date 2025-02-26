// src/controllers/contacts.js

import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

// Пакет http-errors для обробки різних помилок
import createHttpError from 'http-errors';

// utils
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);

    const contacts = await getAllContacts({
      userId: req.user._id,
      page,
      perPage,
      sortBy,
      sortOrder,
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user; // Беремо userId з req.user

    // Виправляємо виклик функції getContactById, додаємо userId
    const contact = await getContactById({ _id: contactId, userId });

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user; // Отримуємо userId з req.user (з middleware або токену)

    // Передаємо userId з req.user в тілі запиту
    const contactData = {
      ...req.body,
      userId, // додаємо userId до даних контакту
    };

    const newContact = await createContact(contactData);

    return res.status(201).json({
      status: 'success',
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user; // Беремо userId з req.user

    const contact = await getContactById({ _id: contactId, userId });

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    const updatedContact = await updateContact(contactId, req.body);

    res.json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user; // Беремо userId з req.user

    const contactToDelete = await getContactById({ _id: contactId, userId });

    if (!contactToDelete) {
      throw createHttpError(404, 'Contact not found');
    }

    await deleteContact(contactId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
