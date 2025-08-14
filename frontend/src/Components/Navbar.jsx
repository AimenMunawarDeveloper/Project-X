import React from "react";
import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [downProfile, setDownProfile] = useState(false);
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const {
    numberOfItemsInCart,
    cart,
    products,
    navigate,
    token,
    setToken,
    setNumberOfItemsInCart,
  } = useContext(ShopContext);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleProfile = () => setDownProfile(!downProfile);

  const logout = () => {
    // Use a timeout to delay the navigation to allow state updates
    localStorage.removeItem("token");
    setToken("");
    setNumberOfItemsInCart(0);
    setTimeout(() => {
      navigate("/login");
    }, 100); // Adjust the timeout if necessary
  };

  return (
    <div className="bg-[var(--Light)]">
      <div className="flex flex-wrap justify-center md:justify-between items-baseline py-5 px-5">
        <NavLink to="/">
          <h1 className="text-3xl font-bold text-black">
            <span className="text-[var(--Pink)]">Project X</span>
          </h1>
        </NavLink>

        <ul className="hidden h-full gap-12 lg:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-lg cursor-pointer pb-1.5 transition-all duration-300 hover:font-bold hover:scale-105 text-[var(--Pink)] ${
                isActive ? "border-b-[3px] border-[var(--Pink)] font-bold" : ""
              }`
            }
          >
            <li>Home</li>
          </NavLink>
          <NavLink
            to="/Collection"
            className={({ isActive }) =>
              `text-lg cursor-pointer pb-1.5 transition-all duration-300 hover:font-bold hover:scale-105 text-[var(--Pink)] ${
                isActive ? "border-b-[3px] border-[var(--Pink)] font-bold" : ""
              }`
            }
          >
            <li>Collection</li>
          </NavLink>
          <NavLink
            to="/About"
            className={({ isActive }) =>
              `text-lg cursor-pointer pb-1.5 transition-all duration-300 hover:font-bold hover:scale-105 text-[var(--Pink)] ${
                isActive ? "border-b-[3px] border-[var(--Pink)] font-bold" : ""
              }`
            }
          >
            <li>About</li>
          </NavLink>
          <NavLink
            to="/Training"
            className={({ isActive }) =>
              `text-lg cursor-pointer pb-1.5 transition-all duration-300 hover:font-bold hover:scale-105 text-[var(--Pink)] ${
                isActive ? "border-b-[3px] border-[var(--Pink)] font-bold" : ""
              }`
            }
          >
            <li>Trainers</li>
          </NavLink>
          <NavLink
            to="/Contact"
            className={({ isActive }) =>
              `text-lg cursor-pointer pb-1.5 transition-all duration-300 hover:font-bold hover:scale-105 text-[var(--Pink)] ${
                isActive ? "border-b-[3px] border-[var(--Pink)] font-bold" : ""
              }`
            }
          >
            <li>Contact</li>
          </NavLink>
        </ul>

        <div className="flex gap-2 items-baseline ">
          <div className="relative"
            onMouseEnter={() => setCartPreviewOpen(true)}
            onMouseLeave={() => setCartPreviewOpen(false)}
          >
            <NavLink to="/Cart">
              <button
                type="button"
                className="text-lg cursor-pointer pb-1.5 transition-all duration-300 px-2 hover:font-bold hover:scale-105 font-serif"
                aria-label="Shopping Cart"
              >
                <i className="fa-solid fa-cart-shopping relative text-[var(--Yellow)]">
                  <span className="absolute right-[-10px] bottom-[-8px] bg-[var(--Brown)] text-[var(--Pink)] text-xs rounded-full px-2 py-1 min-w-[20px] flex items-center justify-center font-bold">
                    {numberOfItemsInCart || 0}
                  </span>
                </i>
              </button>
            </NavLink>
            {/* Cart Preview Dropdown */}
            {cartPreviewOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[var(--Pink)] rounded-lg shadow-lg z-30 animate-fadeIn">
                <div className="p-4">
                  <h3 className="font-bold text-[var(--Pink)] mb-2">Cart Preview</h3>
                  {Object.keys(cart).length === 0 ? (
                    <div className="text-gray-500 text-center py-4">Your cart is empty.</div>
                  ) : (
                    <ul className="divide-y divide-gray-200 max-h-56 overflow-y-auto">
                      {Object.entries(cart).slice(0, 3).map(([id, qty]) => {
                        const product = products.find((p) => p._id === id);
                        if (!product) return null;
                        return (
                          <li key={id} className="flex items-center gap-3 py-2">
                            <img src={product.imageUrl || product.image || product.img || '/placeholder.png'} alt={product.title} className="w-12 h-12 object-cover rounded" />
                            <div className="flex-1">
                              <div className="font-semibold text-[var(--Brown)]">{product.title}</div>
                              <div className="text-xs text-gray-500">Qty: {qty}</div>
                            </div>
                            <div className="font-bold text-[var(--Pink)]">Rs {product.price * qty}</div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {Object.keys(cart).length > 0 && (
                    <div className="mt-4 text-center">
                      <NavLink to="/Cart" className="inline-block bg-[var(--Pink)] text-white px-4 py-2 rounded hover:bg-[var(--Brown)] transition-all duration-200 font-semibold">
                        View Full Cart
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <button
              onClick={toggleProfile}
              type="button"
              className="text-lg cursor-pointer pb-1.5 transition-all duration-300 px-2 hover:font-bold hover:scale-105"
              aria-label="User Profile"
            >
              <i className="fas fa-user text-[var(--Yellow)]"></i>
            </button>
          </div>

          <div className="inline-block cursor-pointer lg:hidden font-bold text-lg pr-3">
            <button
              onClick={toggleDropdown}
              className="text-[var(--Pink)] font-bold text-xl inline-flex items-center hover:scale-105 transition-all duration-300 cursor-pointer"
              type="button"
              aria-label="Menu"
              aria-expanded={dropdownOpen}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>

            {dropdownOpen && (
              <div
                id="dropdown"
                className="fixed z-20 divide-y divide-gray-100 rounded-md shadow-lg bg-[var(--Light)] border border-[var(--Pink)] animate-fadeIn"
              >
                <ul className="py-2 text-sm">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `block px-4 py-3 text-[var(--Pink)] hover:bg-[var(--LightBrown)] transition-all duration-300 ${
                        isActive ? "font-bold border-l-4 border-[var(--Pink)] border-b-[3px]" : ""
                      }`
                    }
                  >
                    <li>Home</li>
                  </NavLink>
                  <NavLink
                    to="/Collection"
                    className={({ isActive }) =>
                      `block px-4 py-3 text-[var(--Pink)] hover:bg-[var(--LightBrown)] transition-all duration-300 ${
                        isActive ? "font-bold border-l-4 border-[var(--Pink)] border-b-[3px]" : ""
                      }`
                    }
                  >
                    <li>Collection</li>
                  </NavLink>
                  <NavLink
                    to="/About"
                    className={({ isActive }) =>
                      `block px-4 py-3 text-[var(--Pink)] hover:bg-[var(--LightBrown)] transition-all duration-300 ${
                        isActive ? "font-bold border-l-4 border-[var(--Pink)] border-b-[3px]" : ""
                      }`
                    }
                  >
                    <li>About</li>
                  </NavLink>
                  <NavLink
                    to="/Training"
                    className={({ isActive }) =>
                      `block px-4 py-3 text-[var(--Pink)] hover:bg-[var(--LightBrown)] transition-all duration-300 ${
                        isActive ? "font-bold border-l-4 border-[var(--Pink)] border-b-[3px]" : ""
                      }`
                    }
                  >
                    <li>Trainers</li>
                  </NavLink>
                  <NavLink
                    to="/Contact"
                    className={({ isActive }) =>
                      `block px-4 py-3 text-[var(--Pink)] hover:bg-[var(--LightBrown)] transition-all duration-300 ${
                        isActive ? "font-bold border-l-4 border-[var(--Pink)] border-b-[3px]" : ""
                      }`
                    }
                  >
                    <li>Contact</li>
                  </NavLink>
                  <hr />
                </ul>
              </div>
            )}

            {downProfile && (
              <div
                id="drop"
                className="fixed z-20 divide-y divide-gray-100 rounded-md shadow-lg bg-[var(--Light)] border border-[var(--Pink)] animate-fadeIn"
              >
                <ul className="py-2 text-sm">
                  {!token && (
                    <li
                      onClick={() => (token ? null : navigate("/Login"))}
                      className="block px-4 py-3 text-[var(--Pink)] hover:bg-[var(--LightBrown)] transition-all duration-300 cursor-pointer"
                    >
                      My Profile
                    </li>
                  )}
                  {token && (
                    <>
                      <li
                        onClick={() => navigate("/Order")}
                        className="block px-4 py-3 text-[var(--Pink)] hover:bg-[var(--LightBrown)] transition-all duration-300 cursor-pointer"
                      >
                        My Orders
                      </li>
                      <li
                        onClick={logout}
                        className="block px-4 py-3 text-[var(--Pink)] hover:bg-[var(--LightBrown)] transition-all duration-300 cursor-pointer"
                      >
                        Log Out
                      </li>
                      <hr />
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="text-lg cursor-pointer pb-1.5 transition-all duration-300 px-2 hover:font-bold hover:scale-105"
                aria-label="User Profile"
              >
                <i className="fas fa-user text-[var(--Yellow)]"></i>
              </button>

              {downProfile && (
                <div
                  id="drop"
                  className="absolute top-full right-0 z-20 divide-y divide-gray-100 rounded-md shadow-lg bg-[var(--Light)] border border-[var(--Pink)] animate-fadeIn"
                >
                  <ul className="py-2 text-sm">
                    {!token && (
                      <li
                        onClick={() => (token ? null : navigate("/Login"))}
                        className="block px-4 py-3 text-[var(--Pink)] hover:bg-[var(--LightBrown)] transition-all duration-300 cursor-pointer whitespace-nowrap"
                      >
                        My Profile
                      </li>
                    )}

                    {token && (
                      <>
                        <li
                          onClick={() => navigate("/Order")}
                          className="block px-4 py-3 text-[var(--Pink)] hover:bg-[var(--LightBrown)] transition-all duration-300 cursor-pointer whitespace-nowrap"
                        >
                          My Orders
                        </li>
                        <li
                          onClick={logout}
                          className="block px-4 py-3 text-[var(--Pink)] hover:bg-[var(--LightBrown)] transition-all duration-300 cursor-pointer whitespace-nowrap"
                        >
                          Log Out
                        </li>
                        <hr />
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
