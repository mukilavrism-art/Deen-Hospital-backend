const express = require("express");
const router = express.Router();
const {
  getApprovedReviews,
  getAllReviews,
  createReview,
  likeReview,
  dislikeReview,
  updateReviewStatus,
  deleteReview,
  getReviewStats
} = require("../controllers/reviewController");
const { adminAuth } = require("../middleware/auth");

// Public routes
router.get("/", getApprovedReviews);
router.post("/", createReview);
router.post("/:id/like", likeReview);      // NEW: Like route
router.post("/:id/dislike", dislikeReview); // NEW: Dislike route

// Admin routes (protected)
router.get("/all", adminAuth, getAllReviews);
router.get("/stats", adminAuth, getReviewStats);
router.patch("/:id/status", adminAuth, updateReviewStatus);
router.delete("/:id", adminAuth, deleteReview);

module.exports = router;
////
