import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExchange,
  faFileContract,
  faShippingFast,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
const Policies = [
  {
    heading: "Return Policy",
    description:
      "Details about our return process, timeframes, and how to request a refund. We offer a 30-day return policy for most items.",
    icon: faExchange,
  },
  {
    heading: "Shipping Information",
    description:
      "Information about our shipping rates, delivery methods, and estimated delivery times. We provide free shipping on orders over $50.",
    icon: faShippingFast,
  },
  {
    heading: "Privacy Policy",
    description:
      "Learn how we protect your personal information. We ensure your data is stored securely and never shared with third parties.",
    icon: faLock,
  },
  {
    heading: "Terms & Conditions",
    description:
      "Our legal terms for using our website and making purchases. Please review our terms before completing your order.",
    icon: faFileContract,
  },
];
const StorePolicy = () => {
  return (
    <div className="bg-[var(--Light)] pb-10">
      <h1 className="font-bold text-3xl text-center text-[var(--Brown)] py-10">
        Our Policies
      </h1>
      <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Policies.map((policy, index) => {
          return (
            <div
              key={index}
              className="block m-3 p-2 border rounded-md shadow-md cursor-pointer hover:scale-105 transition-all text-center"
            >
              <div className="p-4">
                <FontAwesomeIcon
                  icon={policy.icon}
                  className="text-[var(--Brown)]"
                />
                <h2 className="text-lg font-semibold text-[var(--Brown)]">
                  {policy.heading}
                </h2>
                <h2 className="text-md text-[var(--Yellow)] mt-2">
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
