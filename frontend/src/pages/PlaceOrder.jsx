import React, { useState, useContext, useEffect } from "react";
import Total from "../Components/Total";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faArrowLeft, faSpinner, faCreditCard, faCashRegister, faShoppingCart, faShippingFast, faUserCircle } from "@fortawesome/free-solid-svg-icons";

const PlaceOrder = () => {
  const [method, setMethod] = useState("stripe");
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  
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

  const cartProducts = Object.keys(cart)
    .map(key => {
      const product = products.find(prod => prod._id === key);
      return product ? { ...product, quantity: cart[key] } : null;
    })
    .filter(Boolean);

  const calculateFinalAmount = () => {
    return method === "cod"
      ? parseFloat(totalAmount) + Delivery_charges
      : parseFloat(totalAmount);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
    
    // Simulate address suggestions
    if (name === 'street' && value.length > 3) {
      // This is a mock - in a real app, you would call an address API
      const mockSuggestions = [
        `${value}, Main Street, Islamabad`,
        `${value}, Park Road, Islamabad`,
        `${value}, Constitution Avenue, Islamabad`
      ];
      setAddressSuggestions(mockSuggestions);
    } else {
      setAddressSuggestions([]);
    }
  };
  
  const selectAddress = (address) => {
    // Parse the address and populate form fields
    const parts = address.split(', ');
    setFormData({
      ...formData,
      street: parts[0],
      city: parts[2] || formData.city,
    });
    setAddressSuggestions([]);
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.fname) newErrors.fname = "First name is required.";
      if (!formData.lname) newErrors.lname = "Last name is required.";
      if (!formData.email) newErrors.email = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
      }
    }

    if (currentStep === 2) {
      if (!formData.street) newErrors.street = "Street address is required.";
      if (!formData.city) newErrors.city = "City is required.";
      if (!formData.state) newErrors.state = "State is required.";
      if (!formData.zipcode) newErrors.zipcode = "Zip code is required.";
      else if (!/^\d{5,10}$/.test(formData.zipcode)) {
        newErrors.zipcode = "ZipCode must be 5-10 digits.";
    }
      if (!formData.country) newErrors.country = "Country is required.";
    }
    
    if (currentStep === 3) {
      if (!formData.phone) newErrors.phone = "Phone number is required.";
      else if (!/^\d{10,15}$/.test(formData.phone)) {
        newErrors.phone = "Phone number must be 10-15 digits.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      toast.error("Please fill in all required fields correctly.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const placeOrder = async () => {
    if (!validateStep(3)) {
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
    setOrderTotal(finalAmount);
    setLoading(true);

    // Convert cart items to the correct format
    const orderItems = Object.keys(cart).map(itemId => {
      const product = products.find(prod => prod._id === itemId);
      if (product) {
        return {
          ...product,
          quantity: cart[itemId]
        };
      }
      return null;
    }).filter(Boolean);

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        {
          items: orderItems,
          amount: finalAmount,
          address: {
            firstName: formData.fname,
            lastName: formData.lname,
            email: formData.email,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipcode: formData.zipcode,
            country: formData.country,
            phone: formData.phone,
          },
          paymentMethod: method,
        },
        {
          headers: { token },
        }
      );

      setLoading(false);
      if (response.data.success) {
        toast.success("Order placed successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        setCart({});
        setNumberOfItemsInCart(0);
        // Go to order confirmation
        setStep(4);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error placing order:", error);
      toast.error(error.message);
    }
  };

  // Check if cart is empty on mount and redirect if needed
  useEffect(() => {
    if (Object.keys(cart).length === 0) {
      toast.error("Your cart is empty! Add items before checkout.", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/Collection");
    }
  }, []);
  
  const renderStep = () => {
    switch(step) {
      case 1:
  return (
          <div className="border-2 border-[var(--Pink)] bg-[var(--Pink)] p-5 shadow-lg rounded-md animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-[var(--Brown)]">1. Account Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-lg font-bold" htmlFor="fname">
                  First Name:
                </label>
                <input
                  type="text"
                  name="fname"
                  id="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  placeholder="Muhammad"
                  className={`h-10 rounded-md p-4 ${
                    errors.fname ? "border-red-500 border-2" : ""
                  }`}
                />
                {errors.fname && (
                  <span className="text-red-500 text-sm mt-1 font-semibold p-1 rounded">
                    {errors.fname}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col">
                <label className="text-lg font-bold" htmlFor="lname">
                  Last Name:
                </label>
                <input
                  type="text"
                  name="lname"
                  id="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  placeholder="Ahmed"
                  className={`h-10 rounded-md p-4 ${
                    errors.lname ? "border-red-500 border-2" : ""
                  }`}
                />
                {errors.lname && (
                  <span className="text-red-500 text-sm mt-1 font-semibold p-1 rounded">
                    {errors.lname}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col lg:col-span-2">
                <label className="text-lg font-bold" htmlFor="email">
                  Email Address:
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="muhammad.ahmed@gmail.com"
                  className={`h-10 rounded-md p-4 ${
                    errors.email ? "border-red-500 border-2" : ""
                  }`}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1 font-semibold p-1 rounded">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={nextStep}
                className="bg-[var(--Light)] hover:bg-[var(--LightBrown)] text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
              >
                Continue to Shipping
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="border-2 border-[var(--Pink)] bg-[var(--Pink)] p-5 shadow-lg rounded-md animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-[var(--Brown)]">2. Shipping Address</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="flex flex-col lg:col-span-2 relative">
                <label className="text-lg font-bold" htmlFor="street">
                  Street Address:
                </label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="House 123, Street 4, F-8/1"
                  className={`h-10 rounded-md p-4 ${
                    errors.street ? "border-red-500 border-2" : ""
                  }`}
                />
                {errors.street && (
                  <span className="text-red-500 text-sm mt-1 font-semibold p-1 rounded">
                    {errors.street}
                  </span>
                )}
                
                {/* Address suggestions */}
                {addressSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white rounded-md shadow-lg z-10 mt-1">
                    {addressSuggestions.map((suggestion, index) => (
              <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        onClick={() => selectAddress(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <label className="text-lg font-bold" htmlFor="city">
                  City:
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Islamabad"
                  className={`h-10 rounded-md p-4 ${
                    errors.city ? "border-red-500 border-2" : ""
                  }`}
                />
                {errors.city && (
                  <span className="text-red-500 text-sm mt-1 font-semibold p-1 rounded">
                    {errors.city}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col">
                <label className="text-lg font-bold" htmlFor="state">
                  State:
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Federal Territory"
                  className={`h-10 rounded-md p-4 ${
                    errors.state ? "border-red-500 border-2" : ""
                  }`}
                />
                {errors.state && (
                  <span className="text-red-500 text-sm mt-1 font-semibold p-1 rounded">
                    {errors.state}
                  </span>
                )}
        </div>
              
              <div className="flex flex-col">
                <label className="text-lg font-bold" htmlFor="zipcode">
                  ZipCode:
                </label>
                <input
                  type="text"
                  name="zipcode"
                  id="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  placeholder="44000"
                  className={`h-10 rounded-md p-4 ${
                    errors.zipcode ? "border-red-500 border-2" : ""
              }`}
                />
                {errors.zipcode && (
                  <span className="text-red-500 text-sm mt-1 font-semibold p-1 rounded">
                    {errors.zipcode}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col">
                <label className="text-lg font-bold" htmlFor="country">
                  Country:
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Pakistan"
                  className={`h-10 rounded-md p-4 ${
                    errors.country ? "border-red-500 border-2" : ""
                }`}
                />
                {errors.country && (
                  <span className="text-red-500 text-sm mt-1 font-semibold p-1 rounded">
                    {errors.country}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
              </button>
              <button
                onClick={nextStep}
                className="bg-[var(--Light)] hover:bg-[var(--LightBrown)] text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="animate-fadeIn">
            <div className="border-2 border-[var(--Pink)] bg-[var(--Pink)] p-5 shadow-lg rounded-md mb-6">
              <h2 className="text-xl font-bold mb-4 text-[var(--Brown)]">3. Contact & Payment</h2>
              <div className="grid grid-cols-1 gap-5">
                <div className="flex flex-col">
                  <label className="text-lg font-bold" htmlFor="phone">
                    Phone Number:
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className={`h-10 rounded-md p-4 ${
                      errors.phone ? "border-red-500 border-2" : ""
                }`}
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-sm mt-1 font-semibold p-1 rounded">
                      {errors.phone}
                    </span>
                )}
                </div>
              </div>
            </div>
            
            <div className="border-2 border-[var(--Pink)] bg-[var(--Pink)] p-5 shadow-lg rounded-md">
              <h2 className="text-xl font-bold mb-4 text-[var(--Brown)]">Payment Method</h2>
              <div className="grid gap-4">
                <div
                  onClick={() => setMethod("stripe")}
                  className={`flex items-center gap-4 border-2 p-4 cursor-pointer rounded-lg transition-all duration-300 ${
                    method === "stripe"
                      ? "border-[var(--Light)] bg-[var(--Yellow)] shadow-md"
                      : "border-gray-300 hover:border-[var(--Light)]"
                  }`}
                >
                  <FontAwesomeIcon icon={faCreditCard} className="text-xl text-[var(--Light)]" />
                  <div className="flex-1">
                    <h3 className="font-bold">Credit Card</h3>
                    <p className="text-sm text-gray-600">Pay securely with your credit card</p>
                  </div>
                  {method === "stripe" && (
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                  )}
                </div>
                
            <div
              onClick={() => setMethod("cod")}
                  className={`flex items-center gap-4 border-2 p-4 cursor-pointer rounded-lg transition-all duration-300 ${
                method === "cod"
                      ? "border-[var(--Light)] bg-[var(--Yellow)] shadow-md"
                      : "border-gray-300 hover:border-[var(--Light)]"
              }`}
                >
                  <FontAwesomeIcon icon={faCashRegister} className="text-xl text-[var(--Light)]" />
                  <div className="flex-1">
                    <h3 className="font-bold">Cash on Delivery</h3>
                    <p className="text-sm text-gray-600">Pay when you receive your order (+Rs 200)</p>
                  </div>
                  {method === "cod" && (
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className={`bg-[var(--Light)] hover:bg-[var(--LightBrown)] text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Complete Order"
                  )}
                </button>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="border-2 border-[var(--Pink)] bg-[var(--Pink)] p-5 shadow-lg rounded-md text-center animate-fadeIn">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 text-green-500 p-4 rounded-full">
                <FontAwesomeIcon icon={faCheck} className="text-3xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-[var(--Brown)]">Order Successfully Placed!</h2>
            <p className="text-lg mb-6">Thank you for your purchase. You have received project resources by mail.</p>
            
            {/* Enhanced order confirmation details */}
            <div className="bg-white p-4 rounded-md shadow-md mb-6 text-left max-w-xl mx-auto">
              <h3 className="text-xl font-bold mb-3 text-[var(--Brown)] border-b pb-2">Order Details</h3>
              
              <div className="mb-4">
                <h4 className="font-bold text-[var(--Light)]">Shipping Information</h4>
                <p>{formData.fname} {formData.lname}</p>
                <p>{formData.street}</p>
                <p>{formData.city}, {formData.state} {formData.zipcode}</p>
                <p>{formData.country}</p>
                <p>Phone: {formData.phone}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-bold text-[var(--Light)]">Payment Method</h4>
                <p>{method === "stripe" ? "Credit Card" : "Cash on Delivery"}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-bold text-[var(--Light)]">Order Summary</h4>
                <div className="grid grid-cols-3 gap-2 font-semibold border-b pb-1 mt-1">
                  <span>Item</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Price</span>
                </div>
                {cartProducts.map(product => (
                  <div key={product._id} className="grid grid-cols-3 gap-2 border-b py-1">
                    <span className="truncate">{product.title}</span>
                    <span className="text-center">{product.quantity}</span>
                    <span className="text-right">Rs.{product.price * product.quantity}</span>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-2 font-bold mt-2">
                  <span className="col-span-2 text-right">Total:</span>
                  <span className="text-right">Rs.{orderTotal}</span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-600 mt-4">
                <p>A copy of these resources has been sent to your email.</p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => navigate("/Order")}
                className="bg-[var(--Light)] hover:bg-[var(--LightBrown)] text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate("/Collection")}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Persistent order summary
  const renderOrderSummary = () => {
    return (
      <div className="bg-white p-6 rounded-md shadow-lg height-auto animate-fadeIn">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        
        <div className="max-h-80 overflow-y-auto mb-4">
          {cartProducts.map(product => (
            <div key={product._id} className="flex mb-3 pb-3 border-b">
              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-3">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{product.title}</p>
                <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                <p className="text-sm font-bold">Rs.{product.price} x {product.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Total deliveryCharges={method === "cod" ? Delivery_charges : 0} />
        
        {/* Edit Cart Button */}
        <div className="my-4 text-center">
          <button
            onClick={() => navigate("/Cart")}
            className="text-[var(--Light)] hover:text-[var(--LightBrown)] font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center mx-auto"
            title="Go back to cart to make changes"
          >
            <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
            Edit Cart
          </button>
        </div>
        
        {/* Step indicator */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-2">Checkout Progress</p>
          <div className="flex items-center justify-between">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-[var(--Light)]' : 'text-gray-400'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 1 ? 'bg-[var(--Light)] text-white' : 'bg-gray-200'}`}>
                <FontAwesomeIcon icon={faUserCircle} />
              </div>
              <span className="text-xs mt-1">Account</span>
            </div>
            <div className={`flex-1 h-1 mx-1 ${step >= 2 ? 'bg-[var(--Light)]' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-[var(--Light)]' : 'text-gray-400'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 2 ? 'bg-[var(--Light)] text-white' : 'bg-gray-200'}`}>
                <FontAwesomeIcon icon={faShippingFast} />
              </div>
              <span className="text-xs mt-1">Shipping</span>
            </div>
            <div className={`flex-1 h-1 mx-1 ${step >= 3 ? 'bg-[var(--Light)]' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-[var(--Light)]' : 'text-gray-400'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 3 ? 'bg-[var(--Light)] text-white' : 'bg-gray-200'}`}>
                <FontAwesomeIcon icon={faCreditCard} />
              </div>
              <span className="text-xs mt-1">Payment</span>
            </div>
            <div className={`flex-1 h-1 mx-1 ${step >= 4 ? 'bg-[var(--Light)]' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${step >= 4 ? 'text-[var(--Light)]' : 'text-gray-400'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 4 ? 'bg-[var(--Light)] text-white' : 'bg-gray-200'}`}>
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <span className="text-xs mt-1">Complete</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-5 bg-[var(--Background)] grid lg:grid-cols-3 lg:gap-5 sm:grid-cols-1">
      <div className="lg:col-span-2 mb-10">
        <h1 className="font-bold text-2xl mb-5">Checkout</h1>
        
        {/* Current Step Heading */}
        <div className="bg-[var(--Light)] text-white px-4 py-3 rounded-md mb-5 shadow-md animate-fadeIn">
          <h2 className="font-bold text-xl">
            {step === 1 && "Step 1: Account Information"}
            {step === 2 && "Step 2: Shipping Address"}
            {step === 3 && "Step 3: Payment Method"}
            {step === 4 && "Order Complete"}
          </h2>
        </div>
        
        {renderStep()}
      </div>
      
      <div className="mb-6 lg:mb-0">
        {renderOrderSummary()}
      </div>
    </div>
  );
};

export default PlaceOrder;