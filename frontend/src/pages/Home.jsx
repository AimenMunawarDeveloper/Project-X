import React from "react";
import Hero from "../Components/Hero";
import LatestCollection from "../Components/LatestCollection";
import BestSelling from "../Components/BestSelling";
import NewsLetter from "../Components/NewsLetter";

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSelling />
      <NewsLetter />
    </div>
  );
};

export default Home;
