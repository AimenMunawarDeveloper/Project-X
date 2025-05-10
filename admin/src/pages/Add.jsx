import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const Add = ({ token }) => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Tops");
  const [subCategory, setSubCategory] = useState("Men");
  const [BestSell, setBestSell] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim() || !/^[a-zA-Z0-9\s]+$/.test(title)) {
      newErrors.title =
        "Project Name must be alphanumeric and cannot be empty.";
    }
    if (!description.trim() || description.length < 10) {
      newErrors.description =
        "Description must be at least 10 characters long.";
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
    if (sizes.length === 0) {
      newErrors.sizes = "Select at least one size.";
    }
    if (!image) {
      newErrors.image = "Project image is required.";
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
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("image", image);

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
        setPrice("");
        setCategory("Men");
        setSubCategory("Tops");
        setBestSell(false);
        setSizes([]);
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
              hidden
            />
          </label>
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
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
            placeholder="Enter product name"
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
            placeholder="Write product description"
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
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Hoodies">Hoodies</option>
            <option value="Shirts">Shirts</option>
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
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
          {errors.subCategory && (
            <p className="text-red-500 text-sm">{errors.subCategory}</p>
          )}
        </div>

        <div className="col-span-1 sm:col-span-2">
          <p className="text-sm font-medium text-darkbrown mb-2">
            Product Sizes
          </p>
          <div className="flex gap-4 flex-wrap">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(size)
                      ? prev.filter((item) => item !== size)
                      : [...prev, size]
                  )
                }
                className={`px-4 py-2 cursor-pointer rounded-md border ${
                  sizes.includes(size)
                    ? "bg-lightBrown border-darkbrown"
                    : "border-lightBrown"
                }`}
              >
                {size}
              </div>
            ))}
          </div>
          {errors.sizes && (
            <p className="text-red-500 text-sm">{errors.sizes}</p>
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
          className="col-span-1 sm:col-span-2 py-3 mt-6 bg-brown rounded-lg text-white font-semibold"
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
