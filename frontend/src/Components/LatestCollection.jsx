import React from "react";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products, loading } = useContext(ShopContext);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    console.log("products", products);
    setNewArrivals(products.slice(0, 10)); // Slice the first 9 items
  }, [products]);
  if (loading || products.length === 0) {
    return <p>Loading products...</p>; // Show loading state
  }

  return (
    <div className="bg-[var(--Background)]" data-testid="latest-collection">
      <h1 className="font-bold text-3xl text-center text-[var(--Brown)] py-10">
        New Arrivals
      </h1>
      <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-4">
        {newArrivals.map((item, index) => {
          return (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              title={item.title}
              price={item.price.toString()}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LatestCollection;
