import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  try {
    return await ContactsCollection.find();
  } catch (error) {
    throw new Error('Error fetching contacts: ' + error.message);
  }
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
