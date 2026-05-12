const express = require("express");
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
} = require("../controllers/leadController");

// Public routes
router.post("/", createLead);

// Protected routes (Add authentication middleware in production)
router.get("/", getLeads);
router.get("/:id", getLeadById);
router.put("/:id/status", updateLeadStatus);
router.delete("/:id", deleteLead);

module.exports = router;