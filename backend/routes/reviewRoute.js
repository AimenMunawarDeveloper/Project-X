import express from "express";
import { addReview, updateReview, deleteReview, getProductReviews, getUserProductReview } from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";

const reviewRouter = express.Router();

// Add a new review (requires authentication)
reviewRouter.post("/add", authUser, addReview);

// Update a review (requires authentication)
reviewRouter.post("/update", authUser, updateReview);

// Delete a review (requires authentication)
reviewRouter.post("/delete", authUser, deleteReview);

// Get all reviews for a product (no auth required)
reviewRouter.post("/get-product-reviews", getProductReviews);

// Get user's review for a specific product (requires authentication)
reviewRouter.post("/get-user-review", authUser, getUserProductReview);

export default reviewRouter; 