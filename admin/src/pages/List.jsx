import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const List = ({ token }) => {
  const [list, setList] = useState([]);

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

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
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
    }
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
      <h4 className="text-xl font-bold text-brown mb-2">Products List</h4>
      <div className="flex flex-wrap gap-4">
        {list.map((item, index) => (
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2" key={index}>
            <div className="border rounded-lg shadow-lg p-4 flex flex-col items-center h-full">
              <img
                className="w-full h-48 object-cover rounded-t-lg"
                src={item.image[0]}
                alt={item.title}
              />
              <div className="flex flex-col justify-between w-full h-full mt-4 text-[var(--)]">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm">{item.category}</p>
                <p className="mt-2 font-bold">{`${currency}.${item.price}`}</p>
                <p className="mt-2 font-bold text-sm text-justify">
                  {truncateDescription(item.description, 20)}{" "}
                </p>
                <button
                  onClick={() => removeProduct(item._id)}
                  className="mt-4 text-white bg-[var(--Brown)] px-4 py-2 rounded-full hover:bg-[var(--DarkBrown)] focus:outline-none"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

List.propTypes = {
  token: PropTypes.string.isRequired,
};

export default List;
