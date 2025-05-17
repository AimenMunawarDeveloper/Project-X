import React from "react";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";

const BestSelling = () => {
  const { products } = useContext(ShopContext);
  const [bestSelling, setbestSelling] = useState([]);

  useEffect(() => {
    const best = products.filter((item) => item.BestSell === true);
    setbestSelling(best.slice(0, 4));
  }, [products]);

  useEffect(() => {
    const best = products.filter((item) => item.BestSell === true);
    setbestSelling(best.slice(0, 4));
  }, [products]);

  return (
    <div className="bg-[var(--Background)]" data-testid="best-selling">
      <h1 className="font-bold text-3xl text-center text-[var(--Light)] py-10">
        Best Selling
      </h1>
      <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-4">
        {bestSelling.map((item, index) => {
          return (
            <ProductItem
              key={index}
              id={item._id}
              title={item.title}
              image={item.image}
              price={item.price.toString()}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BestSelling;
