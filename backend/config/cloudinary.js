import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  // Main configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    secure: true
  });

  // Configure global delivery settings
  cloudinary.config({
    secure: true,
    secure_distribution: null,
    private_cdn: false,
    force_version: false,
    sign_url: true
  });

  // Log configuration for debugging
  console.log('Cloudinary Configuration:', {
    cloud_name: process.env.CLOUDINARY_NAME,
    secure: true,
    delivery_type: 'upload',
    sign_url: true
  });
};

export default connectCloudinary;
