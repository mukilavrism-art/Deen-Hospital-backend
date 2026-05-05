const express = require("express");
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats
} = require("../controllers/contactController");
const { adminAuth } = require("../middleware/auth");

// Public route
router.post("/", createContact);

// Admin routes (protected)
router.get("/", adminAuth, getAllContacts);
router.get("/stats", adminAuth, getContactStats);
router.get("/:id", adminAuth, getContactById);
router.patch("/:id/status", adminAuth, updateContactStatus);
router.delete("/:id", adminAuth, deleteContact);

module.exports = router;