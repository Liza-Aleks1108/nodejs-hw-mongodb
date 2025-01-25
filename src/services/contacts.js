import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  try {
    const contacts = await ContactsCollection.find({});
    return contacts;
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
