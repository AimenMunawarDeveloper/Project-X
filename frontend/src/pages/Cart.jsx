import React from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Total from "../Components/Total";
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
                <div key={product._id}>
                  <div className="grid grid-cols-2 sm:grid-cols-5 text-lg gap-10 mt-5">
                    <div
                      className="flex flex-wrap justify-start col-span-2 gap-5"
                      data-testid={`cart-item-row-${product._id}`}
                    >
                      <img
                        src={product.image}
                        className="rounded-md shadow-md"
                        alt={product.title}
                        data-testid={`cart-item-image-${product._id}`}
                      />
                      <div className="flex-col">
                        <p data-testid={`cart-item-category-${product._id}`}>
                          {product.category}
                        </p>
                        <p
                          className="font-bold"
                          data-testid={`cart-item-title-${product._id}`}
                        >
                          {product.title}
                        </p>
                      </div>
                    </div>
                    <p className="ml-8">
                      <input
                        type="number"
                        min={1}
                        value={cart[product._id]}
                        className="w-full md:w-20 border-2 border-black rounded-sm p-1"
                        data-testid={`quantity-input-${product._id}`}
                        onChange={(e) =>
                          updateQuantity(product._id, parseInt(e.target.value))
                        }
                      />
                    </p>
                    <p
                      className="font-bold"
                      data-testid={`cart-item-price-${product._id}`}
                    >
                      {curr}.{product.price.toString()}
                    </p>
                    <FontAwesomeIcon
                      icon={faTrash}
                      data-testid={`delete-icon-${product._id}`}
                      className="ml-2 text-red-600 cursor-pointer"
                      onClick={() => {
                        deleteProductFromCart(product._id);
                      }}
                    />
                  </div>
                  <hr className="my-5 border-gray-300" />
                </div>
              );
            })
          ) : (
            <p>Cart is empty</p>
          )}
        </div>
      </div>
      <div className="bg-white p-10 rounded-md shadow-lg height-auto inline-block">
        <Total deliveryCharges={200} />
        <button
          className="bg-[var(--LightBrown)] p-2 rounded-md mt-3"
          onClick={() => navigate("/PlaceOrder")}
        >
          Place Orders
        </button>
      </div>
    </div>
  );
};
export default Cart;
