// src/services/contacts.js

import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = 'asc',
  sortBy = '_id',
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (id) => {
  try {
    const contact = await ContactsCollection.findById(id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createContact = async (payload) => {
  try {
    return await ContactsCollection.create(payload);
  } catch (error) {
    throw new Error('Error creating contact: ' + error.message);
  }
};

export const updateContact = async (contactId, payload, options = {}) => {
  try {
    const updatedContact = await ContactsCollection.findByIdAndUpdate(
      { _id: contactId },
      payload,
      {
        new: true,
        includeResultMetadata: true,
        ...options,
      },
    );
    if (!updatedContact) {
      throw new Error('Contact not found');
    }
    return updatedContact;
  } catch (error) {
    throw new Error('Error updating contact: ' + error.message);
  }
};

export const deleteContact = async (contactId) => {
  try {
    const deletedContact = await ContactsCollection.findByIdAndDelete(
      contactId,
    );
    if (!deletedContact) {
      throw new Error('Contact not found');
    }
    return deletedContact;
  } catch (error) {
    throw new Error('Error deleting contact: ' + error.message);
  }
};
