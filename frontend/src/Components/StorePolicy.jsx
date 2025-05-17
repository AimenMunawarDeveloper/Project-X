import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTruck,
  faLock,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";

const Policies = [
  {
    heading: "Return Policy",
    description:
      "If you're not satisfied, with your purchase, you can return it within 30 days for a full refund.",
    icon: faArrowLeft,
  },
  {
    heading: "Shipping Information",
    description:
      "We don't offer shipping. All products are to be bought online.",
    icon: faTruck,
  },
  {
    heading: "Privacy Policy",
    description:
      "We value your privacy and will not share your personal information with third parties.",
    icon: faLock,
  },
  {
    heading: "Terms & Conditions",
    description:
      "By using our website, you agree to our terms, and conditions — Please read them carefully.",
    icon: faFileLines,
  },
];

const StorePolicy = () => {
  return (
    <div className="bg-[var(--Background)] pb-10">
      <h1 className="font-bold text-3xl text-center text-[var(--Light)] py-10">
        Our Policies
      </h1>
      <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Policies.map((policy, index) => {
          return (
            <div
              key={index}
              className="block m-3 p-2 border rounded-md shadow-lg cursor-pointer hover:scale-105 transition-all text-center shadow-[var(--Light)]"
            >
              <div className="p-4">
                <FontAwesomeIcon
                  icon={policy.icon}
                  className="text-[var(--Brown)]"
                />
                <h2 className="text-lg font-semibold text-[var(--Brown)]">
                  {policy.heading}
                </h2>
                <h2 className="text-md text-[var(--LightBrown)] mt-2">
                  {policy.description}
                </h2>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StorePolicy;
