import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
  try {
    const { title, description, price, category, subCategory, BestSell } = req.body;
    const files = req.files;

    if (!files?.image?.[0] || !files?.projectFiles?.[0] || !files?.documentation?.[0]) {
      return res.json({ 
        success: false, 
        message: "Please provide all required files (image, project files, and documentation)" 
      });
    }

    // Upload image to Cloudinary
    let imageUrl;
    try {
      const imageResult = await cloudinary.uploader.upload(files.image[0].path, {
        resource_type: "image",
      });
      imageUrl = imageResult.secure_url;
    } catch (error) {
      console.error("Image upload error:", error);
      return res.json({ success: false, message: "Error uploading image" });
    }

    // Upload project files (ZIP) to Cloudinary
    let projectFilesUrl;
    try {
      console.log("Attempting to upload project files:", files.projectFiles[0]);
      const projectFilesResult = await cloudinary.uploader.upload(files.projectFiles[0].path, {
        resource_type: "auto",
        upload_preset: "project_files",
        public_id: `project_${Date.now()}`,
        type: "upload",
        access_mode: "public",
        format: "zip",
        allowed_formats: ["zip"],
        use_filename: true,
        folder: "project_files",
        asset_folder: "downloads"
      });
      
      // Use the secure_url directly like we do for images
      projectFilesUrl = projectFilesResult.secure_url;

      console.log("Project files upload details:", {
        url: projectFilesUrl,
        public_id: projectFilesResult.public_id,
        resource_type: projectFilesResult.resource_type,
        format: projectFilesResult.format
      });
    } catch (error) {
      console.error("Project files upload error details:", {
        message: error.message,
        error: error,
        file: files.projectFiles ? files.projectFiles[0] : 'No file found'
      });
      return res.json({ success: false, message: `Error uploading project files: ${error.message}` });
    }

    // Upload documentation (PDF) to Cloudinary
    let documentationUrl;
    try {
      console.log("Attempting to upload documentation:", files.documentation[0]);
      const documentationResult = await cloudinary.uploader.upload(files.documentation[0].path, {
        resource_type: "auto",
        upload_preset: "project_docs",
        public_id: `doc_${Date.now()}`,
        type: "upload",
        access_mode: "public",
        format: "pdf",
        allowed_formats: ["pdf"],
        use_filename: true,
        folder: "documentation",
        asset_folder: "downloads"
      });
      
      // Use the secure_url directly like we do for images
      documentationUrl = documentationResult.secure_url;

      console.log("Documentation upload details:", {
        url: documentationUrl,
        public_id: documentationResult.public_id,
        resource_type: documentationResult.resource_type,
        format: documentationResult.format
      });
    } catch (error) {
      console.error("Documentation upload error details:", {
        message: error.message,
        error: error,
        file: files.documentation ? files.documentation[0] : 'No file found'
      });
      return res.json({ success: false, message: `Error uploading documentation: ${error.message}` });
    }

    const productData = {
      title,
      description,
      category,
      subCategory,
      price: Number(price),
      BestSell: BestSell === "true" ? true : false,
      image: imageUrl,
      projectFiles: projectFilesUrl,
      documentation: documentationUrl,
      date: Date.now(),
    };

    console.log("Saving product with data:", productData);
    
    const product = new productModel(productData);
    await product.save();
    
    res.json({ success: true, message: "Project Added Successfully" });
  } catch (error) {
    console.error("Product addition error:", error);
    res.json({ success: false, message: error.message });
  }
};

// function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };
