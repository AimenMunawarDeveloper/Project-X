import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleRemoveClick = (product) => {
    setProductToDelete(product);
    setShowConfirmation(true);
  };

  const handleConfirmRemove = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id: productToDelete._id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setShowConfirmation(false);
      setProductToDelete(null);
    }
  };

  const handleCancelRemove = () => {
    setShowConfirmation(false);
    setProductToDelete(null);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const truncateDescription = (description, wordLimit = 20) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return description;
  };

  return (
    <>
      <h4 className="text-[var(--Pink)] text-3xl font-bold mb-2 ">Products List</h4>
      <div className="flex flex-wrap gap-4">
        {list.map((item, index) => (
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 shadow-md shadow-[var(--Background)]" key={index}>
            <div className="border rounded-lg shadow-lg p-4 flex flex-col items-center h-full bg-[var(--Background)]">
              <img
                className="w-full h-48 object-cover rounded-t-lg"
                src={item.image}
                alt={item.title}
              />
              <div className="flex flex-col justify-between w-full h-full mt-4">
                <h3 className="text-lg font-semibold text-[var(--Brown)]">{item.title}</h3>
                <p className="text-sm text-[var(--LightBrown)]">{item.category}</p>
                <p className="mt-2 font-bold text-[var(--Light)]">{`${currency}.${item.price}`}</p>
                <p className="mt-2 text-sm text-justify text-[var(--Brown)]">
                  {truncateDescription(item.description, 20)}{" "}
                </p>
                <button
                  onClick={() => handleRemoveClick(item)}
                  className="mt-4 text-white bg-[var(--Light)] hover:bg-[var(--LightBrown)] px-4 py-2 rounded-full focus:outline-none transition-colors duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-[var(--Brown)] mb-4">Confirm Removal</h3>
            <p className="mb-6">
              Are you sure you want to remove <span className="font-bold text-[var(--Light)]">{productToDelete?.title}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelRemove}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--Pink)] transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

List.propTypes = {
  token: PropTypes.string.isRequired,
};

export default List;
