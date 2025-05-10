import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/newsletter",
        {
          email: email,
        }
      );

      toast.success("Subscription successful!", {
        position: "top-right",
        autoClose: 2000,
      });

      setEmail("");
      console.log(response.message);
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-[var(--Light)] flex flex-col items-center py-10 px-5 w-full">
      <h2 className="font-bold text-3xl text-[var(--Brown)] py-5 text-center">
        Stay Updated with Our Latest News
      </h2>
      <p className="text-[var(--Brown)] text-lg pb-2 text-center">
        Subscribe to our newsletter and get the latest updates, offers, and more
        directly to your inbox!
      </p>
      <form
        onSubmit={formSubmitHandler}
        className="flex flex-col sm:flex-row gap-3 items-center w-full max-w-lg"
      >
        <input
          type="email"
          className="text-[var(--Brown)] p-2 m-2 border-2 w-full sm:flex-1"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="bg-[var(--Brown)] rounded-md p-2 m-2 text-white sm:w-auto"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
