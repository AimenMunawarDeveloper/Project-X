import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

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

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim() || !/^[a-zA-Z0-9\s]+$/.test(title)) {
      newErrors.title = "Project Name must be alphanumeric and cannot be empty.";
    }
    if (!description.trim() || description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long.";
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (!category.trim()) {
      newErrors.category = "Category is required.";
    }
    if (!subCategory.trim()) {
      newErrors.subCategory = "Sub-Category is required.";
    }
    if (!image) {
      newErrors.image = "Project image is required.";
    }
    if (!projectFiles) {
      newErrors.projectFiles = "Project code files (ZIP) are required.";
    }
    if (!documentation) {
      newErrors.documentation = "Project documentation (PDF) is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const loadingToast = toast.loading("Uploading project...");

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("BestSell", BestSell);
      formData.append("image", image);
      formData.append("projectFiles", projectFiles);
      formData.append("documentation", documentation);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.update(loadingToast, {
          render: "Project uploaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
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
      } else {
        toast.update(loadingToast, {
          render: response.data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(loadingToast, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl shadow-brown max-w-screen-lg">
      <h2 className="text-3xl font-semibold text-center text-brown mb-6">
        Upload a New Project
      </h2>

      <form
        onSubmit={onSubmitHandler}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        <div className="col-span-1">
          <p className="text-xl font-semibold text-darkbrown mb-4">
            Upload Project Image
          </p>
          <label
            htmlFor="image"
            className="cursor-pointer inline-block border-2 border-gray-300 rounded-lg overflow-hidden"
          >
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : "https://placehold.co/600x400/fff/000?text=Upload"
              }
              alt="image"
              className="w-full object-cover h-40"
            />
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage(file);
                }
              }}
              type="file"
              id="image"
              accept="image/*"
              hidden
            />
          </label>
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>

        <div className="col-span-1">
          <p className="text-xl font-semibold text-darkbrown mb-4">
            Upload Project Files (ZIP)
          </p>
          <label
            htmlFor="projectFiles"
            className="cursor-pointer flex items-center justify-center border-2 border-gray-300 rounded-lg h-40 bg-gray-50 hover:bg-gray-100"
          >
            <div className="text-center">
              <p className="text-lg text-gray-600">
                {projectFiles ? projectFiles.name : "Click to upload ZIP file"}
              </p>
              <p className="text-sm text-gray-500 mt-2">Max size: 50MB</p>
            </div>
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setProjectFiles(file);
                }
              }}
              type="file"
              id="projectFiles"
              accept=".zip"
              hidden
            />
          </label>
          {errors.projectFiles && (
            <p className="text-red-500 text-sm mt-1">{errors.projectFiles}</p>
          )}
        </div>

        <div className="col-span-1 sm:col-span-2">
          <p className="text-xl font-semibold text-darkbrown mb-4">
            Upload Documentation (PDF)
          </p>
          <label
            htmlFor="documentation"
            className="cursor-pointer flex items-center justify-center border-2 border-gray-300 rounded-lg h-32 bg-gray-50 hover:bg-gray-100"
          >
            <div className="text-center">
              <p className="text-lg text-gray-600">
                {documentation ? documentation.name : "Click to upload PDF documentation"}
              </p>
              <p className="text-sm text-gray-500 mt-2">Max size: 50MB</p>
            </div>
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setDocumentation(file);
                }
              }}
              type="file"
              id="documentation"
              accept=".pdf"
              hidden
            />
          </label>
          {errors.documentation && (
            <p className="text-red-500 text-sm mt-1">{errors.documentation}</p>
          )}
        </div>

        <div className="col-span-1 sm:col-span-2">
          <p className="text-sm font-medium text-darkbrown mb-2">
            Project Name
          </p>
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="w-full px-4 py-2 border rounded-md border-lightBrown"
            type="text"
            placeholder="Enter project name"
            required
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        <div className="col-span-1 sm:col-span-2">
          <p className="text-sm font-medium text-darkbrown mb-2">Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full px-4 py-2 border rounded-md border-lightBrown"
            placeholder="Write project description"
            rows="4"
            required
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        <div className="col-span-1 sm:col-span-2">
          <p className="text-sm font-medium text-darkbrown mb-2">Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-4 py-2 border rounded-md border-lightBrown"
            type="number"
            placeholder="Enter price"
            required
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>

        <div className="col-span-1">
          <p className="text-sm font-medium text-darkbrown mb-2">Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-md border-lightBrown"
          >
            <option value="Web">WEB DEVELOPMENT</option>
            <option value="Mobile">MOBILE APPS</option>
            <option value="AI">AI & ML</option>
            <option value="IoT">IoT PROJECTS</option>
            <option value="Database">DATABASE SYSTEMS</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category}</p>
          )}
        </div>

        <div className="col-span-1">
          <p className="text-sm font-medium text-darkbrown mb-2">
            Sub-Category
          </p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-md border-lightBrown"
          >
            <option value="Software">SOFTWARE</option>
            <option value="Hardware">HARDWARE</option>
            <option value="Research">RESEARCH</option>
            <option value="Design">DESIGN</option>
          </select>
          {errors.subCategory && (
            <p className="text-red-500 text-sm">{errors.subCategory}</p>
          )}
        </div>

        <div className="col-span-1 sm:col-span-2 flex items-center gap-3">
          <input
            onChange={() => setBestSell((prev) => !prev)}
            checked={BestSell}
            type="checkbox"
            id="bestseller"
          />
          <label htmlFor="bestseller" className="text-darkbrown cursor-pointer">
            Mark as Bestseller
          </label>
        </div>

        <button
          type="submit"
          className="col-span-1 sm:col-span-2 py-3 mt-6 bg-brown rounded-lg text-white font-semibold hover:bg-opacity-90 transition-all"
        >
          Upload Project
        </button>
      </form>
    </div>
  );
};

Add.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Add;
