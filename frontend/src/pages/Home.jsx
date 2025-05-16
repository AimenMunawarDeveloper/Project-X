import React from "react";
import Hero from "../Components/Hero";
import LatestCollection from "../Components/LatestCollection";
import BestSelling from "../Components/BestSelling";
import NewsLetter from "../Components/NewsLetter";

const Home = () => {
  return (
    <div className="bg-[var(--Background)]">
      <Hero />
      <div className="p-7">
        <LatestCollection />
        <BestSelling />
      </div>

      <NewsLetter />
    </div>
  );
};

export default Home;
