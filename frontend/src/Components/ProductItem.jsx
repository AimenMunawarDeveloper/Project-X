import React from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ProductItem = ({ id, title, image, price }) => {
  const { curr } = useContext(ShopContext);
  return (
    <div>
      <Link
        to={`/Product/${id}`}
        className="block m-3 p-2 border rounded-md shadow-md cursor-pointer hover:scale-105 transition-all"
        data-testid={`product-${id}`}
        style={{
          height: "350px", // Ensure all cards have the same height
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Ensure even spacing for content
        }}
      >
        <div className="relative">
          <img
            src={image[0]}
            alt={title}
            className="w-full h-60 object-cover object-center"
            style={{
              width: "100%",
              height: "240px",
            }}
          />
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold text-[var(--Brown)]">{title}</h2>
          <p className="text-md text-[var(--LightBrown)] gmt-2">
            {curr}.
            {price}
          </p>
        </div>
      </Link>
    </div>
  );
};
ProductItem.propTypes = {
  id: PropTypes.string.isRequired, // ID should be a number and is required
  title: PropTypes.string.isRequired, // Title should be a string and is required
  image: PropTypes.array.isRequired, // Image should be an array and is required
  price: PropTypes.string.isRequired, // Price should be a string and is required
};

export default ProductItem;
