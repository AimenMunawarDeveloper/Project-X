import React from "react";
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Order = () => {
  const { backendUrl, token, curr } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const orders = response.data.orders.reverse();
        setOrderData(orders);
        console.log(orders);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="w-full bg-white p-5 sm:p-10 rounded-md shadow-lg mt-5">
      <h1 className="text-2xl font-bold text-center mb-5">Your Orders</h1>
      {orderData.length === 0 ? (
        <p className="text-center text-gray-500">No orders to display.</p>
      ) : (
        orderData.map((order, index) => (
          <div
            key={order._id}
            className="bg-white rounded-md shadow-md p-5 mb-5"
          >
            {/* Order Header */}
            <div className="flex flex-col md:flex-row justify-between items-center border-b pb-3 mb-3">
              <h2 className="font-bold text-lg text-gray-800">
                Order Number: #{index + 1}
              </h2>
              <div className="text-sm text-gray-600 mt-2 md:mt-0">
                <p className="flex items-center">
                  <span className="font-semibold text-gray-800">Date:</span>{" "}
                  <span className="ml-2 text-gray-600">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <p className="flex items-center mt-1">
                  <span className="font-semibold text-gray-800">Payment:</span>{" "}
                  <span className="ml-2 text-gray-600">
                    {order.paymentMethod}
                  </span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="grid gap-5">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-5 items-center border-b pb-3 last:border-none"
                >
                  <div className="flex gap-5 col-span-1 md:col-span-2">
                    <img
                      src={item.image || "/placeholder-image.jpg"}
                      alt={item.title || "Product"}
                      className="w-24 sm:w-32 md:w-40 rounded-md shadow-md"
                    />
                    <div className="flex flex-col">
                      <p className="text-gray-500">{item.category || "N/A"}</p>
                      <p className="font-bold text-lg text-gray-800">
                        {item.title || "Unnamed Product"}
                      </p>
                      <p className="text-gray-700">
                        {curr}
                        {item.price} - Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center md:justify-end">
                    <button className="px-4 py-2 bg-[var(--Light)] text-white font-semibold rounded-md">
                      {order.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Order;
