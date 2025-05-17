import React from "react";
import picture from "../assets/sc/21.png";
import NewsLetter from "../Components/NewsLetter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faBook,
  faLaptopCode,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import aboutImage from "../assets/about-image.jpg";

const Services = [
  {
    heading: "Monetize Student Work",
    description:
      "Students can sell their projects to earn money and gain real-world experience.",
    icon: faDollarSign,
  },
  {
    heading: "Academic Resource Hub",
    description:
      "Students can access a wide range of academic resources and projects to learn from and grow.",
    icon: faBook,
  },
  {
    heading: "Ready-to-Use Projects",
    description:
      "Students can access ready-to-use projects to learn from and grow.",
    icon: faLaptopCode,
  },
  {
    heading: "Learn From Quality Examples",
    description:
      "Students can learn from quality examples and improve their skills.",
    icon: faGraduationCap,
  },
];

const About = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full bg-[var(--Background)] px-10">
      {/* About Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-[90%] max-w-[1200px] my-10">
        <div className="flex justify-center items-center">
          <img
            src={aboutImage}
            className="max-h-96 object-contain rounded-md shadow-md"
            alt="Sample"
            data-testid="about-image" // <-- Added test ID
          />
        </div>
        <div className="flex flex-col justify-center items-start">
          <h1
            className="text-4xl font-semibold mb-5 text-[var(--Light)]"
            data-testid="about-heading" // <-- Added test ID
          >
            About Project X
          </h1>
          <p className="text-justify text-xl text-[var(--Brown)] mb-10">
            Project X is an innovative online platform designed to empower
            students by allowing them to showcase and sell their academic
            projects. Whether it's a final year thesis, a software prototype, a
            design portfolio, or a research paper — students can turn their
            hard work into real-world value.
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div
        className="bg-[var(--Background)] w-full"
        data-testid="services-section"
      >
        <h1 className="font-bold text-3xl text-center text-[var(--Light)] py-10">
          Why Choose Project X?
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {Services.map((service, index) => {
            return (
              <div
                key={index}
                className="block m-3 p-6 text-center bg-white rounded-lg shadow-lg shadow-[var(--Light)]"
                data-testid={`service-card-${index}`} // <-- Added test ID
              >
                <FontAwesomeIcon
                  icon={service.icon}
                  className="text-5xl text-[var(--Brown)] mb-4"
                />
                <h2
                  className="text-xl font-semibold mb-2 text-[var(--Brown)]"
                  data-testid={`service-heading-${index}`} // <-- Added test ID
                >
                  {service.heading}
                </h2>
                <p
                  className="text-[var(--Brown)]"
                  data-testid={`service-description-${index}`} // <-- Added test ID
                >
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Newsletter Section */}
      <div data-testid="newsletter-section">
        <NewsLetter />
      </div>
    </div>
  );
};

export default About;
