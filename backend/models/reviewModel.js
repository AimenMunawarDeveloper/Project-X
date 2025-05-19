import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  date: { type: Number, required: true, default: Date.now },
});

// Create an index for faster lookup by productId
reviewSchema.index({ productId: 1 });

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel; 