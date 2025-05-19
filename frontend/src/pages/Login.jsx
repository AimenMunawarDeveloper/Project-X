import React from "react";
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [loggedInOrSignIn, setloggedInOrSignIn] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  const validateName = (name) => {
    return name.length >= 3;
  };
  
  const handleBlur = (field) => {
    setTouched({...touched, [field]: true});
    
    // Validate on blur
    if (field === 'email' && email) {
      if (!validateEmail(email)) {
        setErrors({...errors, email: 'Please enter a valid email address'});
      } else {
        const newErrors = {...errors};
        delete newErrors.email;
        setErrors(newErrors);
      }
    }
    
    if (field === 'password' && password) {
      if (!validatePassword(password)) {
        setErrors({...errors, password: 'Password must be at least 6 characters'});
      } else {
        const newErrors = {...errors};
        delete newErrors.password;
        setErrors(newErrors);
      }
    }
    
    if (field === 'name' && name && loggedInOrSignIn === "Sign up") {
      if (!validateName(name)) {
        setErrors({...errors, name: 'Name must be at least 3 characters'});
      } else {
        const newErrors = {...errors};
        delete newErrors.name;
        setErrors(newErrors);
      }
    }
  };
  
  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter(value);
    
    // Real-time validation
    if (touched[name]) {
      if (name === 'email') {
        if (!validateEmail(value) && value) {
          setErrors({...errors, email: 'Please enter a valid email address'});
        } else {
          const newErrors = {...errors};
          delete newErrors.email;
          setErrors(newErrors);
        }
      }
      
      if (name === 'password') {
        if (!validatePassword(value) && value) {
          setErrors({...errors, password: 'Password must be at least 6 characters'});
        } else {
          const newErrors = {...errors};
          delete newErrors.password;
          setErrors(newErrors);
        }
      }
      
      if (name === 'name') {
        if (!validateName(value) && value) {
          setErrors({...errors, name: 'Name must be at least 3 characters'});
        } else {
          const newErrors = {...errors};
          delete newErrors.name;
          setErrors(newErrors);
        }
      }
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const formErrors = {};
    if (!email) formErrors.email = 'Email is required';
    else if (!validateEmail(email)) formErrors.email = 'Please enter a valid email address';
    
    if (!password) formErrors.password = 'Password is required';
    else if (!validatePassword(password)) formErrors.password = 'Password must be at least 6 characters';
    
    if (loggedInOrSignIn === "Sign up") {
      if (!name) formErrors.name = 'Name is required';
      else if (!validateName(name)) formErrors.name = 'Name must be at least 3 characters';
    }
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTouched({
        email: true,
        password: true,
        name: loggedInOrSignIn === "Sign up"
      });
      return;
    }
    
    try {
      if (loggedInOrSignIn === "Sign up") {
        toast.info("Creating your account...", { autoClose: false, toastId: "register" });
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        toast.dismiss("register");
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Account created successfully!");
        } else {
          toast.error(response.data.message || "An error occurred");
        }
      } else {
        toast.info("Signing you in...", { autoClose: false, toastId: "login" });
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        toast.dismiss("login");
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Signed in successfully!");
        } else {
          toast.error(response.data.message || "An error occurred");
        }
      }
    } catch (error) {
      toast.dismiss("login");
      toast.dismiss("register");
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
  
  const getInputClasses = (field) => {
    if (!touched[field]) return "h-12 rounded-md p-4 border-2 border-gray-400 w-full focus:border-[var(--Light)] focus:outline-none";
    if (errors[field]) return "h-12 rounded-md p-4 border-3 border-red-600 bg-red-100 w-full focus:outline-none";
    return "h-12 rounded-md p-4 border-3 border-green-600 bg-green-100 w-full focus:outline-none";
  };

  return (
    <div
      className="flex justify-center 
    items-center md:my-20 my-10"
    >
      <div className="bg-[var(--LightBrown)] rounded-md p-8 w-[95%] sm:w-[85%] md:w-[70%] lg:w-[50%] xl:w-[40%] min-w-[20rem] shadow-lg animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-[var(--Pink)] mb-6">
          {loggedInOrSignIn}
        </h1>
        <form className="grid grid-cols-1 gap-6 mt-5" onSubmit={formHandler}>
          {loggedInOrSignIn === "Sign up" && (
            <div className="flex flex-col">
              <label
                className="text-xl font-semibold text-[var(--Pink)] mb-2"
                htmlFor="name"
              >
                Name:
              </label>
              <div className="relative">
                <input
                  onChange={(e) => handleChange(e, setName)}
                  onBlur={() => handleBlur('name')}
                  value={name}
                  type="text"
                  name="name"
                  id="name"
                  className={getInputClasses('name')}
                  placeholder="e.g Aimen"
                />
                {touched.name && !errors.name && name && (
                  <FontAwesomeIcon 
                    icon={faCheck} 
                    className="absolute right-4 top-4 text-green-600 text-xl"
                  />
                )}
                {touched.name && errors.name && (
                  <FontAwesomeIcon 
                    icon={faTimesCircle} 
                    className="absolute right-4 top-4 text-red-600 text-xl"
                  />
                )}
              </div>
              {touched.name && errors.name && (
                <p className="text-red-600 font-medium text-sm mt-2 bg-white px-3 py-2 rounded-md shadow-sm border-l-4 border-red-600">{errors.name}</p>
              )}
            </div>
          )}
          <div className="flex flex-col">
            <label
              className="text-xl font-semibold text-[var(--Pink)] mb-2"
              htmlFor="email"
            >
              Email:
            </label>
            <div className="relative">
              <input
                onChange={(e) => handleChange(e, setEmail)}
                onBlur={() => handleBlur('email')}
                value={email}
                type="email"
                name="email"
                id="email"
                className={getInputClasses('email')}
                placeholder="e.g aimenmunawarofficial@gmail.com"
              />
              {touched.email && !errors.email && email && (
                <FontAwesomeIcon 
                  icon={faCheck} 
                  className="absolute right-4 top-4 text-green-600 text-xl"
                />
              )}
              {touched.email && errors.email && (
                <FontAwesomeIcon 
                  icon={faTimesCircle} 
                  className="absolute right-4 top-4 text-red-600 text-xl"
                />
              )}
            </div>
            {touched.email && errors.email && (
              <p className="text-red-600 font-medium text-sm mt-2 bg-white px-3 py-2 rounded-md shadow-sm border-l-4 border-red-600">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              className="text-xl font-semibold text-[var(--Pink)] mb-2"
              htmlFor="password"
            >
              Password:
            </label>
            <div className="relative">
              <input
                onChange={(e) => handleChange(e, setPassword)}
                onBlur={() => handleBlur('password')}
                value={password}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className={getInputClasses('password')}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-4 text-gray-700 hover:text-[var(--Brown)] transition-colors"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xl" />
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-red-600 font-medium text-sm mt-2 bg-white px-3 py-2 rounded-md shadow-sm border-l-4 border-red-600">{errors.password}</p>
            )}
            {password && (
              <div className="mt-3">
                <p className="text-sm font-medium text-[var(--Pink)]">Password strength:</p>
                <div className="w-full h-3 bg-gray-300 rounded-full mt-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      password.length < 6 ? 'w-1/4 bg-red-600' : 
                      password.length < 8 ? 'w-2/4 bg-yellow-500' :
                      password.length < 10 ? 'w-3/4 bg-blue-600' :
                      'w-full bg-green-600'
                    }`}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-5 flex justify-between text-base text-[var(--Pink)] font-medium">
            <p className="cursor-pointer hover:underline">Forgot Password?</p>
            <p
              className="cursor-pointer hover:underline"
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
            className={`bg-white p-4 rounded-md w-2/3 mx-auto font-bold text-lg shadow-md transition-all duration-300 mt-4 ${
              Object.keys(errors).length > 0 && Object.keys(touched).length > 0
              ? 'opacity-70 cursor-not-allowed bg-gray-300 text-gray-600'
              : 'hover:bg-[var(--Pink)] hover:text-white hover:shadow-lg'
            }`}
            type="submit"
            disabled={Object.keys(errors).length > 0 && Object.keys(touched).length > 0}
          >
            {loggedInOrSignIn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
