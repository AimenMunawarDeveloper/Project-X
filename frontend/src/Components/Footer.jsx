import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  const handleScrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling effect
    });
  };
  return (
    <div className="bg-[var(--LightBrown)] py-10 sticky top-[100vh]">
      <div className="flex flex-col lg:flex-row justify-between gap-10 px-10 lg:px-20 py-20 w-full ">
        <div className="flex-grow text-center lg:text-left">
          <h1 className="text-3xl font-bold">
            <span className="text-[var(--Pink)]">Project X</span>
          </h1>
        </div>

        <div className="flex flex-col gap-3 flex-grow text-center lg:text-left">
          <h1 className="text-lg font-bold underline decoration-3 decoration-[var(--Pink)] underline-offset-8 text-[var(--Pink)]">
            Quick Links
          </h1>
          <h2
            className="hover:translate-x-2 text-[var(--Background)] hover:text-[var(--Light)] transition duration-300"
            onClick={handleScrollUp}
          >
            <Link to="/">Home</Link>
          </h2>

          <h2
            className="hover:translate-x-2 text-[var(--Background)] hover:text-[var(--Light)] transition duration-300"
            onClick={handleScrollUp}
          >
            <Link to="/About">About Us</Link>
          </h2>
          <h2
            className="hover:translate-x-2 text-[var(--Background)] hover:text-[var(--Light)] transition duration-300"
            onClick={handleScrollUp}
          >
            <Link to="/Training">Training</Link>
          </h2>
          <h2 className="hover:translate-x-2 text-[var(--Background)] hover:text-[var(--Light)] transition duration-300">
            <Link to="/Collection" onClick={handleScrollUp}>
              Collections
            </Link>
          </h2>
        </div>
        <div className="flex flex-col gap-3 flex-grow text-center lg:text-left">
          <h1 className="text-lg font-bold underline decoration-3 decoration-[var(--Pink)] underline-offset-8 text-[var(--Pink)]">
            <Link to="/Contact" onClick={handleScrollUp}>
              Contact Us{" "}
            </Link>
          </h1>
          <div>
            <h2 className="hover:translate-x-2 text-[var(--Background)] hover:text-[var(--Light)] transition duration-300">
              +222-899-22233
            </h2>
            <h2 className="hover:translate-x-2 text-[var(--Background)] hover:text-[var(--Light)] transition duration-300">
              craftsy@gmail.com
            </h2>
          </div>
          <div className="flex gap-3 flex-grow justify-center lg:justify-start">
            <h2 className="text-[var(--Background)] hover:text-[var(--Light)]">
              <Link
                to="/"
                className="hover:text-[var(--Light)] text-xl transition duration-300"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </Link>
            </h2>
            <h2 className="text-[var(--Background)] hover:text-[var(--Light)]">
              <Link
                to="/"
                className="hover:text-[var(--Light)] text-xl transition duration-300"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
            </h2>
            <h2 className="text-[var(--Background)] hover:text-[var(--Light)]">
              <Link
                to="/"
                className="hover:text-[var(--Light)] text-xl transition duration-300"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
            </h2>
            <h2 className="text-[var(--Background)] hover:text-[var(--Light)]">
              <Link
                to="/"
                className="hover:text-[var(--Light)] text-xl transition duration-300"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </Link>
            </h2>
          </div>
        </div>
      </div>
      <div className="text-center text-[var(--Background)]">
        <h4>Copyright 2025@projectX.com-All Rights Reserved</h4>
      </div>
    </div>
  );
};

export default Footer;
