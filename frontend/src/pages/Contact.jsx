import React, { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [formValues, setFormValues] = useState({
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
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = Object.keys(formValues);

    requiredFields.forEach((field) => {
      if (!formValues[field]) {
        newErrors[field] = "This field is required.";
      }
    });

    if (formValues.email && !/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (formValues.phone && !/^\d{10,15}$/.test(formValues.phone)) {
      newErrors.phone = "Phone number must be 10-15 digits.";
    }

    if (formValues.zipcode && !/^\d{5,10}$/.test(formValues.zipcode)) {
      newErrors.zipcode = "ZipCode must be 5-10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setSending(true);
        const response = await fetch("http://localhost:4000/api/user/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Form Submitted Successfully:", data);
          toast.success("Contact Form submitted!", {
            position: "top-right",
            autoClose: 2000,
          });
          setSubmitted(true); // Set the submitted state to true
          setFormValues({
            fname: "",
            lname: "",
            email: "",
            street: "",
            city: "",
            state: "",
            zipcode: "",
            country: "",
            phone: "",
          }); // Clear form fields
        } else {
          console.error("Failed to submit form:", data.message);
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error.message);
      } finally {
        setSending(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-10">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-10 w-full max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-black mb-10">
            Get in <span className="text-[var(--Light)]">touch</span>
          </h1>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {[
              { name: "fname", label: "First Name", type: "text", placeholder: "Muhammad" },
              { name: "lname", label: "Last Name", type: "text", placeholder: "Ahmed" },
              { name: "email", label: "Email Address", type: "email", placeholder: "muhammad.ahmed@gmail.com" },
              { name: "street", label: "Street Address", type: "text", placeholder: "House 123, Street 4, F-8/1" },
              { name: "city", label: "City", type: "text", placeholder: "Islamabad" },
              { name: "state", label: "State", type: "text", placeholder: "Federal Territory" },
              { name: "zipcode", label: "ZipCode", type: "text", placeholder: "44000" },
              { name: "country", label: "Country", type: "text", placeholder: "Pakistan" },
              { name: "phone", label: "Phone Number", type: "tel", placeholder: "03XXXXXXXXX" },
            ].map(({ name, label, type, placeholder }) => (
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
                  value={formValues[name]}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  className={`h-10 rounded-md p-4 border-b-2 ${
                    errors[name] ? "border-[var(--Pink)]" : ""
                  }`}
                />
                {errors[name] && (
                  <span className="text-[var(--Pink)] text-sm mt-1">
                    {errors[name]}
                  </span>
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={sending}
              className={`lg:col-span-2 ${
                sending 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[var(--Light)] hover:bg-[var(--LightBrown)]"
              } text-white font-bold py-3 px-5 rounded-md text-lg transition-colors duration-200`}
            >
              {sending ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13286.264708969924!2d72.98424626977534!3d33.64248880000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df9675aaaaaaab%3A0xc5180922c44eb86b!2sNational%20University%20of%20Sciences%20%26%20Technology%20(NUST)!5e0!3m2!1sen!2s!4v1734370219502!5m2!1sen!2s"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
