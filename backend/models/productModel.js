import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  BestSell: { type: Boolean },
  date: { type: Number, required: true },
  projectFiles: { type: String, required: true }, // URL to zip file containing project code
  documentation: { type: String, required: true }, // URL to PDF documentation
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
