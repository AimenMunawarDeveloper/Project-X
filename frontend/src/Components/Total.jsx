import React from "react";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";
import PropTypes from "prop-types";

const Total = ({ deliveryCharges }) => {
  const { curr, totalAmount } = useContext(ShopContext);

  return (
    <div>
      <h2 className="font-bold text-2xl mb-10 text-[var(--Primary)] ">
        Total Amount
      </h2>
      <div className="my-1 flex justify-between">
        <p>Subtotal:</p>
        <p>
          {curr}
          {totalAmount}
        </p>
      </div>
      <hr />
      <div className="my-1 flex justify-between">
        <p>Delivery Charges:</p>
        <p>
          {curr}
          {deliveryCharges.toFixed(2)}
        </p>
      </div>
      <hr />
      <div className="my-1 flex justify-between">
        <p>Total:</p>
        <p data-testid="total-amount">
          {curr}
          {(parseFloat(totalAmount) + parseFloat(deliveryCharges)).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

Total.propTypes = {
  deliveryCharges: PropTypes.number.isRequired,
};

export default Total;
