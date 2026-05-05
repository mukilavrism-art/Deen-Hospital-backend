const Review = require("../models/Review");

// Get approved reviews (public)
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(reviews);
  } catch (error) {
    console.error("Error in getApprovedReviews:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all reviews (admin only)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error in getAllReviews:", error);
    res.status(500).json({ error: error.message });
  }
};

// Submit new review (public)
const createReview = async (req, res) => {
  try {
    const { name, text, rating } = req.body;
    
    if (!name || !text || !rating) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const review = new Review({
      name: name.trim(),
      text: text.trim(),
      rating: parseInt(rating),
      status: "pending",
      likes: 0,
      dislikes: 0
    });
    
    await review.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Review submitted successfully and pending approval"
    });
  } catch (error) {
    console.error("Error in createReview:", error);
    res.status(500).json({ error: error.message });
  }
};

// NEW: Like a review
const likeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userIdentifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    // Check if user already disliked
    if (review.dislikedBy.includes(userIdentifier)) {
      // Remove from dislikedBy and decrement dislikes
      review.dislikedBy = review.dislikedBy.filter(id => id !== userIdentifier);
      review.dislikes = Math.max(0, review.dislikes - 1);
    }
    
    // Check if user already liked
    if (!review.likedBy.includes(userIdentifier)) {
      review.likedBy.push(userIdentifier);
      review.likes += 1;
    } else {
      // User already liked - remove like (toggle)
      review.likedBy = review.likedBy.filter(id => id !== userIdentifier);
      review.likes = Math.max(0, review.likes - 1);
    }
    
    await review.save();
    
    res.json({
      success: true,
      likes: review.likes,
      dislikes: review.dislikes,
      userLiked: review.likedBy.includes(userIdentifier),
      userDisliked: review.dislikedBy.includes(userIdentifier)
    });
  } catch (error) {
    console.error("Error in likeReview:", error);
    res.status(500).json({ error: error.message });
  }
};

// NEW: Dislike a review
const dislikeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userIdentifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    // Check if user already liked
    if (review.likedBy.includes(userIdentifier)) {
      // Remove from likedBy and decrement likes
      review.likedBy = review.likedBy.filter(id => id !== userIdentifier);
      review.likes = Math.max(0, review.likes - 1);
    }
    
    // Check if user already disliked
    if (!review.dislikedBy.includes(userIdentifier)) {
      review.dislikedBy.push(userIdentifier);
      review.dislikes += 1;
    } else {
      // User already disliked - remove dislike (toggle)
      review.dislikedBy = review.dislikedBy.filter(id => id !== userIdentifier);
      review.dislikes = Math.max(0, review.dislikes - 1);
    }
    
    await review.save();
    
    res.json({
      success: true,
      likes: review.likes,
      dislikes: review.dislikes,
      userLiked: review.likedBy.includes(userIdentifier),
      userDisliked: review.dislikedBy.includes(userIdentifier)
    });
  } catch (error) {
    console.error("Error in dislikeReview:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update review status (admin only)
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    const review = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    res.json({ success: true, review });
  } catch (error) {
    console.error("Error in updateReviewStatus:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete review (admin only)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get review statistics (admin only)
const getReviewStats = async (req, res) => {
  try {
    const total = await Review.countDocuments();
    const approved = await Review.countDocuments({ status: "approved" });
    const pending = await Review.countDocuments({ status: "pending" });
    const rejected = await Review.countDocuments({ status: "rejected" });
    
    const avgRatingResult = await Review.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, avg: { $avg: "$rating" } } }
    ]);
    
    res.json({
      total,
      pending,
      approved,
      rejected,
      averageRating: avgRatingResult[0]?.avg || 0
    });
  } catch (error) {
    console.error("Error in getReviewStats:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getApprovedReviews,
  getAllReviews,
  createReview,
  likeReview,
  dislikeReview,
  updateReviewStatus,
  deleteReview,
  getReviewStats
};