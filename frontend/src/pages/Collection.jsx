import React from "react";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../Components/ProductItem";
import StorePolicy from "../Components/StorePolicy";
const Collection = () => {
  const { products } = useContext(ShopContext);
  const [ourCollection, setOurCollection] = useState([]);
  const [sortOption, setSortOption] = useState("Default");
  const [searchQuery, setSearchQuery] = useState("");
  const [cat, setCat] = useState("Default");
  const [Subcat, setSubCat] = useState("Default");
  useEffect(() => {
    let filteredCollection = products.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.price.toString().toLowerCase().includes(searchLower) ||
        item.subCategory.toString().toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
    });

    const getPriceValue = (priceString) => {
      return parseFloat(priceString.replace("Rs", ""));
    };

    if (cat !== "Default") {
      filteredCollection = filteredCollection.filter(
        (item) => item.category === cat
      );
    }
    if (Subcat !== "Default") {
      filteredCollection = filteredCollection.filter(
        (item) => item.subCategory === Subcat
      );
    }

    if (sortOption === "LowToHigh") {
      filteredCollection.sort(
        (a, b) =>
          getPriceValue(a.price.toString()) - getPriceValue(b.price.toString())
      );
    } else if (sortOption === "HighToLow") {
      filteredCollection.sort(
        (a, b) =>
          getPriceValue(b.price.toString()) - getPriceValue(a.price.toString())
      );
    }

    setOurCollection(filteredCollection);
  }, [products, sortOption, searchQuery, cat, Subcat]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  const handleCategories = (e) => {
    setCat(e.target.value);
  };
  const handleSubCategories = (e) => {
    setSubCat(e.target.value);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bg-[var(--Background)]">
      <div className="p-7">
        <div className="flex flex-wrap justify-between text-base">
          <div className=" font-bold text-3xl text-[var(--Primary)] md:py-0">
            _Our Collection_.
          </div>
          <div className=" block  md:flex ">
            <select
              className="bg-[var(--Background)] pr-10 pl-2  mr-2 text-[var(--Secondary)] border border-[var(--Secondary)] rounded-md"
              value={Subcat}
              onChange={handleSubCategories}
            >
              <option value={"Default"}>DEFAULT</option>
              <option value={"Women"}>WOMEN</option>
              <option value={"Men"}>MEN</option>
              <option value={"Kids"}>KIDS</option>
            </select>
            <select
              className="bg-[var(--Background)] pr-10 pl-2  mr-2 text-[var(--Secondary)] border border-gray-400 rounded-md"
              value={cat}
              onChange={handleCategories}
            >
              <option value={"Default"}>DEFAULT</option>
              <option value={"Bottoms"}>BOTTOMS</option>
              <option value={"Tops"}>TOPS</option>
              <option value={"Shirts"}>SHIRTS</option>
              <option value={"Hoodies"}>HOODIES</option>
            </select>
            <select
              className="bg-[var(--Background)] md:pr-10 md:pl-2 text-[var(--Secondary)]  border border-[var(--Secondary)] rounded-md"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value={"Default"}>DEFAULT</option>
              <option value={"LowToHigh"}>LOW TO HIGH</option>
              <option value={"HighToLow"}>HIGH TO LOW</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative w-3/4 m-3">
            <input
              type="text"
              className="w-full rounded-2xl py-2 px-3 border border-[var(--Secondary)] text-md"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--Secondary)]"></i>
          </div>
        </div>
        <div
          className="grid grid-cols md:grid-cols-2 lg:grid-cols-4"
          data-testid="product-collection"
        >
          {ourCollection.map((item, index) => {
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
        <StorePolicy />
      </div>
    </div>
  );
};

export default Collection;
