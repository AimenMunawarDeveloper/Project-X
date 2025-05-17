import React from "react";
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [loggedInOrSignIn, setloggedInOrSignIn] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const formHandler = async (e) => {
    e.preventDefault();
    try {
      if (loggedInOrSignIn === "Sign up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message || "An error occurred");
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message || "An error occurred");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div
      className="flex justify-center 
    items-center md:my-20 my-10 "
    >
      <div className="bg-[var(--LightBrown)] rounded-md p-5 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] min-w-[18rem]">
        <h1 className="text-2xl font-semibold text-center text-[var(--Pink)]">
          {loggedInOrSignIn}
        </h1>
        <form className="grid grid-cols-1 gap-5 mt-5" onSubmit={formHandler}>
          {loggedInOrSignIn === "Sign up" && (
            <div className="flex flex-col">
              <label
                className="text-lg font-semibold text-[var(--Pink)]"
                htmlFor="name"
              >
                Name:
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                name="name"
                id="name"
                className="h-10 rounded-md p-4 border border-gray-300"
                required
                placeholder="e.g Aimen"
              />
            </div>
          )}
          <div className="flex flex-col">
            <label
              className="text-lg font-semibold text-[var(--Pink)]"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              name="email"
              id="email"
              className="h-10 rounded-md p-4 border border-gray-300"
              required
              placeholder="e.g aimenmunawarofficial@gmail.com"
            />
          </div>
          <div className="flex flex-col">
            <label
              className="text-lg font-semibold text-[var(--Pink)]"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              name="password"
              id="password"
              className="h-10 rounded-md p-4 border border-gray-300"
              required
            />
          </div>
          <div className="mt-5 flex justify-between text-sm text-[var(--Pink)]">
            <p className="cursor-pointer underline">Forgot Password?</p>
            <p
              className="cursor-pointer underline"
              onClick={() =>
                setloggedInOrSignIn(
                  loggedInOrSignIn === "Sign up" ? "Login" : "Sign up"
                )
              }
            >
              {loggedInOrSignIn === "Sign up" ? "Login" : "Create Account"}
            </p>
          </div>
          <button
            className="bg-white p-3 rounded-md max-w-30 justify-self-center"
            type="submit"
          >
            {" "}
            <p className="text-lg font-semibold">{loggedInOrSignIn}</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
