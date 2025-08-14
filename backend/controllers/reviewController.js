import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

// Add a new review
const addReview = async (req, res) => {
  try {
    const { productId, rating, reviewText } = req.body;
    const userId = req.body.userId; // From auth middleware
    
    // Get the user's name from the database
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    // Check if the user has already reviewed this product
    const existingReview = await reviewModel.findOne({ userId, productId });
    if (existingReview) {
      return res.json({ 
        success: false, 
        message: "You have already reviewed this product. Please edit your existing review.",
        existingReview
      });
    }
    
    // Create a new review
    const review = new reviewModel({
      userId,
      productId,
      userName: user.name,
      rating,
      reviewText,
      date: Date.now(),
    });
    
    await review.save();
    
    res.json({ 
      success: true, 
      message: "Review added successfully",
      review
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.json({ success: false, message: error.message });
  }
};

// Update an existing review
const updateReview = async (req, res) => {
  try {
    const { reviewId, rating, reviewText } = req.body;
    const userId = req.body.userId; // From auth middleware
    
    // Find the review and make sure it belongs to this user
    const review = await reviewModel.findById(reviewId);
    
    if (!review) {
      return res.json({ success: false, message: "Review not found" });
    }
    
    if (review.userId !== userId) {
      return res.json({ success: false, message: "You can only edit your own reviews" });
    }
    
    // Update the review
    review.rating = rating;
    review.reviewText = reviewText;
    review.date = Date.now(); // Update the timestamp
    
    await review.save();
    
    res.json({ 
      success: true, 
      message: "Review updated successfully",
      review
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.json({ success: false, message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;
    const userId = req.body.userId; // From auth middleware
    
    // Find the review and make sure it belongs to this user
    const review = await reviewModel.findById(reviewId);
    
    if (!review) {
      return res.json({ success: false, message: "Review not found" });
    }
    
    if (review.userId !== userId) {
      return res.json({ success: false, message: "You can only delete your own reviews" });
    }
    
    // Delete the review
    await reviewModel.findByIdAndDelete(reviewId);
    
    res.json({ 
      success: true, 
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Find all reviews for this product and sort by date (newest first)
    const reviews = await reviewModel
      .find({ productId })
      .sort({ date: -1 });
    
    // Calculate average rating
    const ratings = reviews.map(review => review.rating);
    const averageRating = ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) 
      : 0;
    
    res.json({ 
      success: true, 
      reviews,
      totalReviews: reviews.length,
      averageRating
    });
  } catch (error) {
    console.error("Error getting product reviews:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get user's review for a specific product
const getUserProductReview = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.body.userId;
    
    const review = await reviewModel.findOne({ userId, productId });
    
    res.json({ 
      success: true, 
      hasReviewed: !!review,
      review
    });
  } catch (error) {
    console.error("Error getting user review:", error);
    res.json({ success: false, message: error.message });
  }
};

export { addReview, updateReview, deleteReview, getProductReviews, getUserProductReview }; 