const Contact = require("../models/Contact");

// Submit contact form (public)
const createContact = async (req, res) => {
  try {
    const { name, phone, city, message } = req.body;
    
    // Validation
    if (!name || !phone || !city || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const contact = new Contact({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      message: message.trim(),
      status: "new"
    });
    
    await contact.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Contact form submitted successfully" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all contacts (admin only)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });
    
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single contact (admin only)
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update contact status (admin only)
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    
    res.json({ success: true, contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete contact (admin only)
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    
    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get contact statistics (admin only)
const getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    const total = await Contact.countDocuments();
    
    res.json({
      total,
      stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats
};