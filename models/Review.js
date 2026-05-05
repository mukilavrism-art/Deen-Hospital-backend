const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  text: {
    type: String,
    required: [true, "Review text is required"],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 1,
    max: 5
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  // NEW: Like/Dislike fields
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: String, // Store IP or user ID to prevent multiple votes
    unique: true
  }],
  dislikedBy: [{
    type: String,
    unique: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better performance
reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ likes: -1 }); // For sorting by popularity

module.exports = mongoose.model("Review", reviewSchema);