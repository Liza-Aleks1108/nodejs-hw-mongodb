// src/controllers/contacts.js

import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

//пакет http-errors для опрацювання різних помилок
import createHttpError from 'http-errors';

//utils
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const { _id: userId } = req.user;

    const contacts = await getAllContacts({
      userId,
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
    const { _id: userId } = req.user;

    const contact = await getContactById(contactId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    if (contact.owner.toString() !== userId) {
      throw createHttpError(403, 'Access denied');
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
    const { _id: userId } = req.user; // Отримуємо userId залогіненого користувача
    const newContact = await createContact({ ...req.body, owner: userId }); // Передаємо userId у сервіс

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;

    const contact = await getContactById(contactId);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    if (contact.owner.toString() !== userId) {
      throw createHttpError(403, 'Access denied');
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
    const { _id: userId } = req.user;

    const contactToDelete = await getContactById(contactId);
    if (!contactToDelete) {
      throw createHttpError(404, 'Contact not found');
    }

    if (contactToDelete.owner.toString() !== userId) {
      throw createHttpError(403, 'Access denied');
    }

    await deleteContact(contactId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
