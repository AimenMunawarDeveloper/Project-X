import React, { useState, useContext } from "react";
import Total from "../Components/Total";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [method, setMethod] = useState("stripe");
  const [errors, setErrors] = useState({});
  const {
    cart,
    totalAmount,
    backendUrl,
    token,
    navigate,
    Delivery_charges,
    products,
    setCart,
    setNumberOfItemsInCart,
  } = useContext(ShopContext);

  const calculateFinalAmount = () => {
    return method === "cod"
      ? parseFloat(totalAmount) + Delivery_charges
      : parseFloat(totalAmount);
  };

  const validateForm = (formData) => {
    const newErrors = {};
    const requiredFields = [
      "fname",
      "lname",
      "email",
      "street",
      "city",
      "state",
      "zipcode",
      "country",
      "phone",
    ];

    requiredFields.forEach((field) => {
      if (!formData.get(field)) {
        newErrors[field] = "This field is required.";
      }
    });

    // Additional validations
    if (formData.get("email") && !/\S+@\S+\.\S+/.test(formData.get("email"))) {
      newErrors.email = "Invalid email address.";
    }

    if (formData.get("phone") && !/^\d{10,15}$/.test(formData.get("phone"))) {
      newErrors.phone = "Phone number must be 10-15 digits.";
    }

    if (
      formData.get("zipcode") &&
      !/^\d{5,10}$/.test(formData.get("zipcode"))
    ) {
      newErrors.zipcode = "ZipCode must be 5-10 digits.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all valid shipping details.", {
        position: "top-right",
        autoClose: 2000,
      });
      return false;
    }
    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = async () => {
    const formData = new FormData(document.querySelector("form"));
    const address = {
      firstName: formData.get("fname"),
      lastName: formData.get("lname"),
      email: formData.get("email"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zipcode: formData.get("zipcode"),
      country: formData.get("country"),
      phone: formData.get("phone"),
    };

    // Validate the form
    if (!validateForm(formData)) {
      return;
    }

    if (!Object.keys(cart).length) {
      toast.error("Your cart is empty!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const finalAmount = calculateFinalAmount();

    let orderItems = [];
    for (const itemId in cart) {
      for (const size in cart[itemId]) {
        if (cart[itemId][size] > 0) {
          const product = structuredClone(
            products.find((prod) => prod._id === itemId)
          );
          if (product) {
            product.size = size;
            product.quantity = cart[itemId][size];
            orderItems.push(product);
          }
        }
      }
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        {
          items: orderItems,
          amount: finalAmount,
          address,
          paymentMethod: method,
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success("Order placed successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        setCart({});
        setNumberOfItemsInCart(0);
        navigate("/Order");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="p-5 bg-[var(--Background)] grid lg:grid-cols-3 lg:gap-5 sm:grid-cols-1">
      <div className="lg:col-span-2 mb-10">
        <h1 className="font-bold text-2xl mb-5">Shipping Information</h1>
        <div className="border-2 border-[var(--Pink)] p-5 shadow-lg rounded-md">
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              { name: "fname", label: "First Name", type: "text" },
              { name: "lname", label: "Last Name", type: "text" },
              { name: "email", label: "Email Address", type: "email" },
              { name: "street", label: "Street Address", type: "text" },
              { name: "city", label: "City", type: "text" },
              { name: "state", label: "State", type: "text" },
              { name: "zipcode", label: "ZipCode", type: "text" },
              { name: "country", label: "Country", type: "text" },
              { name: "phone", label: "Phone Number", type: "tel" },
            ].map(({ name, label, type }, idx) => (
              <div
                key={name}
                className={`flex flex-col ${
                  name === "email" || name === "street" || name === "phone"
                    ? "lg:col-span-2"
                    : ""
                }`}
              >
                <label className="text-lg font-bold" htmlFor={name}>
                  {label}:
                </label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  className={`h-10 rounded-md p-4 ${
                    errors[name] ? "border-[var(--Pink)] border-2" : ""
                  }`}
                />
                {errors[name] && (
                  <span className="text-[var(--Pink)] text-sm mt-1">
                    {errors[name]}
                  </span>
                )}
              </div>
            ))}
          </form>
        </div>
        <div className="mt-10">
          <h2 className="font-bold text-2xl mb-5">Payment Method</h2>
          <div className="grid gap-4">
            <div
              onClick={() => setMethod("stripe")}
              className={`flex items-center gap-4 border-2 p-4 cursor-pointer rounded-lg  ${
                method === "stripe"
                  ? "border-[var(--Pink)] bg-[var()] shadow-md"
                  : "border-gray-300 bg-white"
              }`}
              data-testid="payment-method-stripe"
            >
              <div
                className={`w-5 h-5 border rounded-full flex justify-center items-center ${
                  method === "stripe" ? "bg-[var(--Pink)]" : ""
                }`}
              >
                {method === "stripe" && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                )}
              </div>
              <img
                className="h-8"
                src="/src/assets/stripe_logo.png"
                alt="Stripe"
              />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className={`flex items-center gap-4 border-2 p-4 cursor-pointer rounded-lg  ${
                method === "razorpay"
                  ? "border-[var(--Pink)] bg-[var()] shadow-md"
                  : "border-gray-300 bg-white"
              }`}
              data-testid="payment-method-razorpay"
            >
              <div
                className={`w-5 h-5 border rounded-full flex justify-center items-center ${
                  method === "razorpay" ? "bg-[var(--Pink)]" : ""
                }`}
              >
                {method === "razorpay" && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                )}
              </div>
              <img
                className="h-8"
                src="/src/assets/razorpay_logo.png"
                alt="Razorpay"
              />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className={`flex items-center gap-4 border-2 p-4 cursor-pointer rounded-lg  ${
                method === "cod"
                  ? "border-[var(--Pink)] bg-[var()] shadow-md"
                  : "border-gray-300 bg-white"
              }`}
              data-testid="payment-method-cod"
            >
              <div
                className={`w-5 h-5 border rounded-full flex justify-center items-center ${
                  method === "cod" ? "bg-[var(--Pink)]" : ""
                }`}
              >
                {method === "cod" && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                )}
              </div>
              <span>Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-10 rounded-md shadow-lg">
        <Total deliveryCharges={method === "cod" ? Delivery_charges : 0} />
        <button
          className="bg-[var(--Primary)] text-[var(--Background)] p-2 rounded-md mt-3"
          onClick={placeOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
