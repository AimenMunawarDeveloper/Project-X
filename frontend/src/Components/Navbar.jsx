import React from "react";
import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [downProfile, setDownProfile] = useState(false);
  const {
    numberOfItemsInCart,
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
    <div className="bg-[var(--Primary)] text-[var(--Muted)]">
      <div className="flex flex-wrap justify-center md:justify-between items-baseline py-5 px-5">
        <NavLink to="/">
          <h1 className="text-3xl font-bold text-black">
            <span className="text-[var(--Muted)]">Project X</span>
          </h1>
        </NavLink>

        <ul className="hidden h-full gap-12 lg:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-lg cursor-pointer pb-1.5 transition-all hover:font-bold text-[var(--Pink)] ${
                isActive ? "border-b-2 border-[var(--Pink)]" : ""
              }`
            }
          >
            <li>Home</li>
          </NavLink>
          <NavLink
            to="/Collection"
            className={({ isActive }) =>
              `text-lg cursor-pointer pb-1.5 transition-all hover:font-bold text-[var(--Muted)] ${
                isActive ? "border-b-2 border-[var(--Background)]" : ""
              }`
            }
          >
            <li>Collection</li>
          </NavLink>
          <NavLink
            to="/About"
            className={({ isActive }) =>
              `text-lg cursor-pointer pb-1.5 transition-all hover:font-bold text-[var(--Muted)] ${
                isActive ? "border-b-2 border-[var(--Background)]" : ""
              }`
            }
          >
            <li>About</li>
          </NavLink>
          <NavLink
            to="/Training"
            className={({ isActive }) =>
              `text-lg cursor-pointer pb-1.5 transition-all hover:font-bold text-[var(--Muted)] ${
                isActive ? "border-b-2 border-[var(--Background)]" : ""
              }`
            }
          >
            <li>Trainers</li>
          </NavLink>
          <NavLink
            to="/Contact"
            className={({ isActive }) =>
              `text-lg cursor-pointer pb-1.5 transition-all hover:font-bold text-[var(--Muted)] ${
                isActive ? "border-b-2 border-[var(--Background)]" : ""
              }`
            }
          >
            <li>Contact</li>
          </NavLink>
        </ul>

        <div className="flex gap-2 items-baseline ">
          <div>
            <NavLink to="/Cart">
              <button
                type="button"
                className="text-lg cursor-pointer pb-1.5 transition-all px-2 hover:font-bold font-serif"
              >
                <i className="fa-solid fa-cart-shopping relative text-[var(--Muted)]">
                  <p className="absolute right-[-7px] bottom-[-5px] bg-[var(--Secondary)] text-white text-[8px] rounded-full p-1">
                    {numberOfItemsInCart || 0}
                  </p>
                </i>
              </button>
            </NavLink>
          </div>

          <div className="lg:hidden text-[var(--Muted)]">
            <button
              onClick={toggleProfile}
              type="button"
              className="text-lg cursor-pointer pb-1.5 transition-all px-2 hover:font-bold text-[var(--Muted)]"
            >
              <i className="fas fa-user text-[var(--Muted)]"></i>
            </button>
          </div>

          <div className="inline-block cursor-pointer lg:hidden font-bold text-lg pr-3">
            <button
              onClick={toggleDropdown}
              className="text-[var(--Pink)] font-bold text-xl inline-flex items-center hover:scale-105 transition-all cursor-pointer"
              type="button"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>

            {dropdownOpen && (
              <div
                id="dropdown"
                className="fixed z-20 divide-y divide-gray-100 rounded-md shadow bg-[var()]"
              >
                <ul className="py-2 text-sm">
                  <NavLink
                    to="/"
                    className="block px-2 text-[var(--Brown)] py-2 hover:text--800"
                  >
                    <li>Home</li>
                  </NavLink>
                  <NavLink
                    to="/Collection"
                    className="block px-2 text-[var(--Brown)] py-2 hover:text--800"
                  >
                    <li>Collection</li>
                  </NavLink>
                  <NavLink
                    to="/About"
                    className="block px-2 text-[var(--Brown)] py-2 hover:text--800"
                  >
                    <li>About</li>
                  </NavLink>
                  <NavLink
                    to="/Training"
                    className="block px-2 text-[var(--Brown)] py-2 hover:text--800"
                  >
                    <li>Trainers</li>
                  </NavLink>
                  <NavLink
                    to="/Contact"
                    className="block px-2 text-[var(--Brown)] py-2 hover:text--800"
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
                className="fixed z-20 divide-y divide-gray-100 rounded-md shadow bg-[var()]"
              >
                <ul className="py-2 text-sm">
                  {!token && (
                    <li
                      onClick={() => (token ? null : navigate("/Login"))}
                      className="block px-2 text-[var(--Brown)] py-2 hover:text--800"
                    >
                      My Profile
                    </li>
                  )}
                  {token && (
                    <>
                      <li
                        onClick={() => navigate("/Order")}
                        className="block px-2 text-[var(--Brown)] py-2 hover:text--800"
                      >
                        My Orders
                      </li>
                      <li
                        onClick={logout}
                        className="block px-2 text-[var(--Brown)] py-2 hover:text--800"
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
                className="text-lg cursor-pointer pb-1.5 transition-all px-2 hover:font-bold"
              >
                <i className="fas fa-user text-[var(--Muted)]"></i>
              </button>

              {downProfile && (
                <div
                  id="drop"
                  className="absolute top-full right-0 z-20 divide-y divide-gray-100 rounded-md shadow bg-[var(--Muted)] hover:bg-[var(--Primary)]"
                >
                  <ul className="py-2 text-sm">
                    {!token && (
                      <li
                        onClick={() => (token ? null : navigate("/Login"))}
                        className="block px-2 text-[var(--Primary)] hover:text-[var(--Muted)] py-2 cursor-pointer"
                      >
                        My Profile
                      </li>
                    )}

                    {token && (
                      <>
                        <li
                          onClick={() => navigate("/Order")}
                          className="block cursor-pointer px-2 text-[var(--Primary)] hover:text-[var(--Muted)] py-2 "
                        >
                          My Orders
                        </li>
                        <li
                          onClick={logout}
                          className="block cursor-pointer px-2 text-[var(--Primary)] hover:text-[var(--Muted)] py-2 "
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
