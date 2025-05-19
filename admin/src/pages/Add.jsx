import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faExclamationTriangle, faCheckCircle, faImage, faFile, faFilePdf, faSpinner } from "@fortawesome/free-solid-svg-icons";

const Add = ({ token }) => {
  const [image, setImage] = useState(null);
  const [projectFiles, setProjectFiles] = useState(null);
  const [documentation, setDocumentation] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Web");
  const [subCategory, setSubCategory] = useState("Software");
  const [BestSell, setBestSell] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState({
    image: false,
    projectFiles: false,
    documentation: false
  });
  
  const categories = [
    "Web", "Mobile", "Desktop", "Game", "AI", "IoT", "Blockchain", "Other"
  ];
  
  const subCategories = {
    "Web": ["Software", "Design", "E-commerce", "Blog", "Portfolio", "Other"],
    "Mobile": ["Android", "iOS", "React Native", "Flutter", "Other"],
    "Desktop": ["Windows", "macOS", "Linux", "Cross-platform", "Other"],
    "Game": ["2D", "3D", "Multiplayer", "Single Player", "Other"],
    "AI": ["Machine Learning", "Neural Networks", "NLP", "Computer Vision", "Other"],
    "IoT": ["Home Automation", "Industrial", "Wearables", "Other"],
    "Blockchain": ["Smart Contracts", "DeFi", "NFT", "Other"],
    "Other": ["Other"]
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };
  
  const validateField = (field) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'title':
    if (!title.trim() || !/^[a-zA-Z0-9\s]+$/.test(title)) {
      newErrors.title = "Project Name must be alphanumeric and cannot be empty.";
        } else {
          delete newErrors.title;
    }
        break;
      case 'description':
    if (!description.trim() || description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long.";
        } else {
          delete newErrors.description;
    }
        break;
      case 'price':
    if (!price || isNaN(price) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number.";
        } else {
          delete newErrors.price;
        }
        break;
      case 'image':
    if (!image) {
      newErrors.image = "Project image is required.";
        } else {
          delete newErrors.image;
    }
        break;
      case 'projectFiles':
    if (!projectFiles) {
      newErrors.projectFiles = "Project code files (ZIP) are required.";
        } else {
          delete newErrors.projectFiles;
    }
        break;
      case 'documentation':
    if (!documentation) {
      newErrors.documentation = "Project documentation (PDF) is required.";
        } else {
          delete newErrors.documentation;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    // Validate all fields
    const fields = ['title', 'description', 'price', 'image', 'projectFiles', 'documentation'];
    let isValid = true;
    
    fields.forEach(field => {
      setTouched(prev => ({ ...prev, [field]: true }));
      const fieldValid = validateField(field);
      isValid = isValid && fieldValid;
    });
    
    return isValid;
  };

  const togglePreview = () => {
    if (!previewMode && !validateForm()) {
      toast.error("Please fill all required fields correctly before previewing");
      return;
    }
    setPreviewMode(!previewMode);
  };
  
  const resetForm = () => {
    if (confirm("Are you sure you want to reset the form? All your progress will be lost.")) {
      setTitle("");
      setDescription("");
      setImage(null);
      setProjectFiles(null);
      setDocumentation(null);
      setPrice("");
      setCategory("Web");
      setSubCategory("Software");
      setBestSell(false);
      setErrors({});
      setTouched({});
      setPreviewMode(false);
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Update file state
      if (type === 'image') setImage(file);
      if (type === 'projectFiles') setProjectFiles(file);
      if (type === 'documentation') setDocumentation(file);
      
      // Mark as touched for validation
      setTouched(prev => ({ ...prev, [type]: true }));
      
      // Clear any previous errors for this field
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[type];
        return newErrors;
      });
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // Initial validation
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Preparing to upload project...");

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("BestSell", BestSell);
      
      // For each file, set the uploading status
      if (image) {
        setUploadingStatus(prev => ({ ...prev, image: true }));
      formData.append("image", image);
      }
      
      if (projectFiles) {
        setUploadingStatus(prev => ({ ...prev, projectFiles: true }));
      formData.append("projectFiles", projectFiles);
      }
      
      if (documentation) {
        setUploadingStatus(prev => ({ ...prev, documentation: true }));
      formData.append("documentation", documentation);
      }
      
      // Update toast message to indicate files are uploading to Cloudinary
      toast.update(loadingToast, {
        render: "Uploading files to cloud storage...",
        isLoading: true
      });

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { 
          headers: { 
            token,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            toast.update(loadingToast, {
              render: `Uploading files: ${percentCompleted}% complete`,
              isLoading: true
            });
          }
        }
      );

      if (response.data.success) {
        toast.update(loadingToast, {
          render: "Project uploaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        
        // Reset all form fields
        setTitle("");
        setDescription("");
        setImage(null);
        setProjectFiles(null);
        setDocumentation(null);
        setPrice("");
        setCategory("Web");
        setSubCategory("Software");
        setBestSell(false);
        setErrors({});
        setTouched({});
        setPreviewMode(false);
        setUploadingStatus({
          image: false,
          projectFiles: false,
          documentation: false
        });
      } else {
        toast.update(loadingToast, {
          render: response.data.message || "Upload failed. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      
      // Check if it's a Cloudinary-related error
      const errorMsg = error.response?.data?.message || error.message;
      if (errorMsg.includes("Cloudinary") || errorMsg.includes("upload") || errorMsg.includes("file")) {
        toast.update(loadingToast, {
          render: "File upload failed. Please ensure your files are valid and try again.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
      toast.update(loadingToast, {
          render: errorMsg || "An unexpected error occurred",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
      setUploadingStatus({
        image: false,
        projectFiles: false,
        documentation: false
      });
    }
  };
  
  const renderPreview = () => {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6 mb-8 animate-fadeIn">
        <h3 className="text-2xl font-bold text-brown mb-4">Project Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            {image ? (
              <img 
                src={URL.createObjectURL(image)} 
                alt={title} 
                className="w-full rounded-lg shadow-md object-cover aspect-square"
              />
            ) : (
              <div className="w-full rounded-lg shadow-md aspect-square bg-gray-200 flex items-center justify-center">
                <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-400" />
              </div>
            )}
            
            <div className="mt-4">
              <span className="inline-block bg-[var(--Light)] text-white px-3 py-1 rounded-full text-sm font-semibold mr-2">
                {category}
              </span>
              <span className="inline-block bg-[var(--Pink)] text-[var(--Brown)] px-3 py-1 rounded-full text-sm font-semibold">
                {subCategory}
              </span>
              {BestSell && (
                <span className="inline-block bg-[var(--Yellow)] text-white px-3 py-1 rounded-full text-sm font-semibold mt-2">
                  Bestseller
                </span>
              )}
            </div>
            
            <div className="mt-4">
              <h4 className="text-xl font-bold text-[var(--Brown)]">Files:</h4>
              <div className="flex items-center mt-2 border p-2 rounded">
                <FontAwesomeIcon icon={faFile} className="text-[var(--Light)] mr-2" />
                <span className="text-sm truncate">{projectFiles?.name || "No project files"}</span>
              </div>
              <div className="flex items-center mt-2 border p-2 rounded">
                <FontAwesomeIcon icon={faFilePdf} className="text-[var(--Light)] mr-2" />
                <span className="text-sm truncate">{documentation?.name || "No documentation"}</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-[var(--Brown)]">{title || "Project Title"}</h2>
            <p className="text-2xl font-bold text-[var(--LightBrown)] mt-2">Rs.{price || "0.00"}</p>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-[var(--Brown)]">Description:</h3>
              <p className="mt-2 text-gray-700 whitespace-pre-line">
                {description || "No description provided."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={togglePreview}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
          >
            Back to Editing
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl shadow-brown max-w-screen-lg">
      <h2 className="text-3xl font-semibold text-center text-brown mb-6">
        {previewMode ? "Preview Project" : "Upload a New Project"}
      </h2>

      {previewMode ? (
        renderPreview()
      ) : (
      <form
        onSubmit={onSubmitHandler}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 animate-fadeIn"
          encType="multipart/form-data"
      >
        <div className="col-span-1">
          <p className="text-xl font-semibold text-darkbrown mb-4">
            Upload Project Image
          </p>
          <label
            htmlFor="image"
              className={`cursor-pointer inline-block border-2 ${
                touched.image && errors.image 
                  ? "border-red-500" 
                  : touched.image && !errors.image 
                  ? "border-green-500" 
                  : "border-gray-300"
              } rounded-lg overflow-hidden relative group w-full`}
            >
              {uploadingStatus.image ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-white text-3xl" />
                </div>
              ) : null}
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : "https://placehold.co/600x400/fff/000?text=Upload"
              }
              alt="image"
                className="w-full object-cover h-40 group-hover:opacity-80 transition-opacity duration-300"
            />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-40">
                <FontAwesomeIcon icon={faUpload} className="text-white text-3xl" />
              </div>
            <input
                onChange={(e) => handleFileSelect(e, 'image')}
              type="file"
              id="image"
                name="image"
              accept="image/*"
              hidden
            />
          </label>
            {touched.image && errors.image && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                {errors.image}
              </p>
            )}
            {touched.image && !errors.image && image && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                Image selected successfully
              </p>
          )}
        </div>

        <div className="col-span-1">
          <p className="text-xl font-semibold text-darkbrown mb-4">
            Upload Project Files (ZIP)
          </p>
          <label
            htmlFor="projectFiles"
              className={`cursor-pointer flex items-center justify-center border-2 ${
                touched.projectFiles && errors.projectFiles 
                  ? "border-red-500 bg-red-50" 
                  : touched.projectFiles && !errors.projectFiles 
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-300 bg-gray-50"
              } rounded-lg h-40 hover:bg-gray-100 transition-colors duration-300 group relative`}
            >
              {uploadingStatus.projectFiles ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10 rounded-lg">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-white text-3xl" />
                </div>
              ) : null}
            <div className="text-center">
                {projectFiles ? (
                  <>
                    <p className="text-lg text-gray-700 font-medium">
                      {projectFiles.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {(projectFiles.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUpload} className="text-gray-400 text-3xl mb-2 group-hover:text-[var(--Light)] transition-colors duration-300" />
              <p className="text-lg text-gray-600">
                      Click to upload ZIP file
              </p>
              <p className="text-sm text-gray-500 mt-2">Max size: 50MB</p>
                  </>
                )}
            </div>
            <input
                onChange={(e) => handleFileSelect(e, 'projectFiles')}
              type="file"
              id="projectFiles"
                name="projectFiles"
              accept=".zip"
              hidden
            />
          </label>
            {touched.projectFiles && errors.projectFiles && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                {errors.projectFiles}
              </p>
            )}
            {touched.projectFiles && !errors.projectFiles && projectFiles && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                Project files selected successfully
              </p>
          )}
        </div>

        <div className="col-span-1 sm:col-span-2">
          <p className="text-xl font-semibold text-darkbrown mb-4">
            Upload Documentation (PDF)
          </p>
          <label
            htmlFor="documentation"
              className={`cursor-pointer flex items-center justify-center border-2 ${
                touched.documentation && errors.documentation 
                  ? "border-red-500 bg-red-50" 
                  : touched.documentation && !errors.documentation 
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-300 bg-gray-50"
              } rounded-lg h-32 hover:bg-gray-100 transition-colors duration-300 group relative`}
            >
              {uploadingStatus.documentation ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10 rounded-lg">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-white text-3xl" />
                </div>
              ) : null}
            <div className="text-center">
                {documentation ? (
                  <>
                    <p className="text-lg text-gray-700 font-medium">
                      {documentation.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {(documentation.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faFilePdf} className="text-gray-400 text-3xl mb-2 group-hover:text-[var(--Light)] transition-colors duration-300" />
              <p className="text-lg text-gray-600">
                      Click to upload PDF documentation
              </p>
              <p className="text-sm text-gray-500 mt-2">Max size: 50MB</p>
                  </>
                )}
            </div>
            <input
                onChange={(e) => handleFileSelect(e, 'documentation')}
              type="file"
              id="documentation"
                name="documentation"
              accept=".pdf"
              hidden
            />
          </label>
            {touched.documentation && errors.documentation && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                {errors.documentation}
              </p>
            )}
            {touched.documentation && !errors.documentation && documentation && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                Documentation selected successfully
              </p>
          )}
        </div>

          <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="title" className="text-xl font-semibold text-darkbrown mb-2">
            Project Name
              </label>
          <input
                type="text"
                id="title"
            value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (touched.title) validateField('title');
                }}
                onBlur={() => handleBlur('title')}
            placeholder="Enter project name"
                className={`p-3 border ${
                  touched.title && errors.title 
                    ? "border-red-500 bg-red-50" 
                    : touched.title && !errors.title 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Light)] focus:border-transparent`}
            required
          />
              {touched.title && errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

            <div className="flex flex-col">
              <label htmlFor="price" className="text-xl font-semibold text-darkbrown mb-2">
                Price (Rs)
              </label>
          <input
                type="number"
                id="price"
            value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (touched.price) validateField('price');
                }}
                onBlur={() => handleBlur('price')}
            placeholder="Enter price"
                className={`p-3 border ${
                  touched.price && errors.price 
                    ? "border-red-500 bg-red-50" 
                    : touched.price && !errors.price 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Light)] focus:border-transparent`}
            required
          />
              {touched.price && errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

            <div className="flex flex-col">
              <label className="text-xl font-semibold text-darkbrown mb-2">
                Category
              </label>
          <select
            value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory(subCategories[e.target.value][0]);
                }}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Light)] focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
          </select>
        </div>

            <div className="flex flex-col">
              <label className="text-xl font-semibold text-darkbrown mb-2">
            Sub-Category
              </label>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Light)] focus:border-transparent"
              >
                {subCategories[category].map((subCat) => (
                  <option key={subCat} value={subCat}>
                    {subCat}
                  </option>
                ))}
          </select>
            </div>

            <div className="flex flex-col col-span-1 sm:col-span-2">
              <label htmlFor="description" className="text-xl font-semibold text-darkbrown mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (touched.description) validateField('description');
                }}
                onBlur={() => handleBlur('description')}
                placeholder="Enter project description"
                className={`p-3 border ${
                  touched.description && errors.description 
                    ? "border-red-500 bg-red-50" 
                    : touched.description && !errors.description 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-300"
                } rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--Light)] focus:border-transparent`}
                required
              />
              {touched.description && errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center">
          <input
                  type="checkbox"
                  id="bestSeller"
            checked={BestSell}
                  onChange={(e) => setBestSell(e.target.checked)}
                  className="w-4 h-4 text-[var(--Light)] border-gray-300 rounded focus:ring-[var(--Light)]"
          />
                <label htmlFor="bestSeller" className="ml-2 text-lg text-darkbrown">
                  Mark as Best Seller
          </label>
              </div>
            </div>
        </div>

          <div className="col-span-1 sm:col-span-2 flex justify-between mt-6">
            <div>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300 mr-2"
              >
                Reset Form
              </button>
              <button
                type="button"
                onClick={togglePreview}
                className="px-6 py-3 bg-[var(--Yellow)] text-white rounded-md hover:bg-[var(--LightBrown)] transition-colors duration-300"
              >
                Preview
              </button>
            </div>
        <button
          type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className={`px-8 py-3 rounded-md transition-colors duration-300 ${
                isSubmitting || Object.keys(errors).length > 0
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[var(--Light)] text-white hover:bg-[var(--LightBrown)]"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Uploading...
                </span>
              ) : "Upload Project"}
        </button>
          </div>
      </form>
      )}
    </div>
  );
};

Add.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Add;
