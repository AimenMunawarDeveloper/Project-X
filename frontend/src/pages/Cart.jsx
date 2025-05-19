import React from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus, faShoppingBag, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Total from "../Components/Total";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, products, updateQuantity, curr, deleteProductFromCart } =
    useContext(ShopContext);
  const keys = Object.keys(cart);
  const findingProductsFromKeys = () => {
    return keys
      .map((key) => products.find((prod) => prod._id === key))
      .filter(Boolean);
  };
  const cartProducts = findingProductsFromKeys();
  
  const handleIncrement = (productId, currentQty) => {
    updateQuantity(productId, currentQty + 1);
    toast.info("Quantity updated", { autoClose: 1000 });
  };
  
  const handleDecrement = (productId, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
      toast.info("Quantity updated", { autoClose: 1000 });
    } else {
      deleteProductFromCart(productId);
    }
  };
  
  const handleRemove = (productId, productName) => {
    deleteProductFromCart(productId);
    toast.success(`${productName} removed from cart`, { autoClose: 2000 });
  };

  return (
    <div className="p-5 bg-gray-300 grid lg:grid-cols-3 lg:gap-5 sm:grid-cols-1">
      {/* Shopping Bag Section */}
      <div className="lg:col-span-2">
        <h1 className="font-bold text-2xl">Shopping Bag</h1>
        <div className="bg-white mt-10 p-10 rounded-md shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-5 text-xl my-5 font-semibold gap-10">
            <p className="col-span-2 block">Product</p>
            <p className="block ml-8">Quantity</p>
            <p className="block">Price</p>
          </div>
          {cartProducts.length > 0 ? (
            cartProducts.map((product) => {
              return (
                <div key={product._id} className="animate-fadeIn">
                  <div className="grid grid-cols-2 sm:grid-cols-5 text-lg gap-10 mt-5">
                    <div
                      className="flex flex-wrap justify-start col-span-2 gap-5"
                      data-testid={`cart-item-row-${product._id}`}
                    >
                      <img
                        src={product.image}
                        className="rounded-md shadow-md hover:shadow-lg transition-all duration-300 w-24 h-24 object-cover"
                        alt={product.title}
                        data-testid={`cart-item-image-${product._id}`}
                      />
                      <div className="flex-col">
                        <p 
                          data-testid={`cart-item-category-${product._id}`}
                          className="text-gray-600"
                        >
                          {product.category}
                        </p>
                        <p
                          className="font-bold text-lg"
                          data-testid={`cart-item-title-${product._id}`}
                        >
                          {product.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-start ml-8">
                      <div className="flex items-center border-2 border-[var(--Light)] rounded-md">
                        <button 
                          className="px-3 py-1 text-[var(--Light)] hover:bg-[var(--Light)] hover:text-white transition-colors duration-300"
                          onClick={() => handleDecrement(product._id, cart[product._id])}
                          aria-label="Decrease quantity"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="w-10 text-center font-medium">
                          {cart[product._id]}
                        </span>
                        <button 
                          className="px-3 py-1 text-[var(--Light)] hover:bg-[var(--Light)] hover:text-white transition-colors duration-300"
                          onClick={() => handleIncrement(product._id, cart[product._id])}
                          aria-label="Increase quantity"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                    <p
                      className="font-bold"
                      data-testid={`cart-item-price-${product._id}`}
                    >
                      {curr}.{product.price.toString()}
                    </p>
                    <button
                      aria-label="Remove item"
                      className="ml-2 text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-300"
                      onClick={() => handleRemove(product._id, product.title)}
                    >
                      <FontAwesomeIcon 
                        icon={faTrash} 
                        data-testid={`delete-icon-${product._id}`}
                        className="hover:scale-110 transition-transform duration-300"
                      />
                    </button>
                  </div>
                  <hr className="my-5 border-gray-300" />
                </div>
              );
            })
          ) : (
            <div className="text-center py-10">
              <FontAwesomeIcon icon={faShoppingBag} className="text-gray-400 text-5xl mb-4" />
              <p className="text-xl text-gray-600 mb-2">Your cart is empty</p>
              <p className="text-gray-500 mb-6">Add items to your cart to see them here</p>
              <button 
                onClick={() => navigate('/Collection')}
                className="flex items-center justify-center mx-auto bg-[var(--Light)] hover:bg-[var(--LightBrown)] text-white px-6 py-3 rounded-md transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
      {cartProducts.length > 0 && (
        <div className="bg-white p-10 rounded-md shadow-lg height-auto inline-block animate-fadeIn">
          <Total deliveryCharges={200} />
          <button
            className="bg-[var(--Light)] hover:bg-[var(--LightBrown)] w-full p-3 rounded-md mt-3 text-[var(--Pink)] font-bold transition-colors duration-300"
            onClick={() => navigate("/PlaceOrder")}
          >
            Place Orders
          </button>
        </div>
      )}
    </div>
  );
};
export default Cart;
