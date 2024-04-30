const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModels");

// @desc Get all Contacts
// @route GET /api/contacts
// access PRIVATE
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

// @desc Get Contact
// @route GET /api/contacts/:id
// access PRIVATE
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact Not Found.");
  }
  res.status(200).json(contact);
});

// @desc Create Contact
// @route POST /api/contacts
// access PRIVATE
const createContact = asyncHandler(async (req, res) => {
  console.log("The new Contact send by server is:", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All Fields are mandatory!!!");
  }

  const contact = await Contact.create({
    name: req.body.name,
    email,
    phone,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
});

// @desc Update Contact
// @route PUT /api/contacts/:id
// access PRIVATE
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact Not Found.");
  }
  if (contact.user_id.toString() !== req.user.id) {
    req.status(403);
    throw new Error("User don't have permission to update other user contacts.")    
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

// @desc Delete Contact
// @route DELETE /api/contacts/:id
// access PRIVATE
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact Not Found.");
  }
  if (contact.user_id.toString() !== req.user.id) {
    req.status(403);
    throw new Error("User don't have permission to update other user contacts.")    
  }
  await Contact.findByIdAndDelete(req.params.id);
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
