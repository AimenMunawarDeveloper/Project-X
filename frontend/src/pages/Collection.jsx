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
  
  // Define categories and subcategories to match Add.jsx
  const categories = [
    "Web", "Mobile", "Desktop", "Game", "AI", "IoT", "Blockchain", "Other"
  ];
  
  const subCategories = {
    "Default": ["Default"],
    "Web": ["Software", "Design", "E-commerce", "Blog", "Portfolio", "Other"],
    "Mobile": ["Android", "iOS", "React Native", "Flutter", "Other"],
    "Desktop": ["Windows", "macOS", "Linux", "Cross-platform", "Other"],
    "Game": ["2D", "3D", "Multiplayer", "Single Player", "Other"],
    "AI": ["Machine Learning", "Neural Networks", "NLP", "Computer Vision", "Other"],
    "IoT": ["Home Automation", "Industrial", "Wearables", "Other"],
    "Blockchain": ["Smart Contracts", "DeFi", "NFT", "Other"],
    "Other": ["Other"]
  };
  
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
    const newCategory = e.target.value;
    setCat(newCategory);
    // Reset subcategory when category changes
    setSubCat("Default");
  };
  
  const handleSubCategories = (e) => {
    setSubCat(e.target.value);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bg-[var(--Background)] px-10">
      <div className="flex flex-wrap justify-between text-base py-4">
        <div className="font-bold text-3xl text-[var(--Light)] py-4 md:py-0">
          _Our Collection_.
        </div>
        <div className="block md:flex">
          <select
            className="bg-[var(--Background)] pr-10 pl-2 mr-2 text-[var(--Brown)] border border-gray-400 rounded-md hover:border-[var(--Brown)] focus:border-[var(--Brown)] focus:outline-none focus:ring-0 cursor-pointer"
            value={cat}
            onChange={handleCategories}
          >
            <option value="Default">ALL CATEGORIES</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.toUpperCase()}
              </option>
            ))}
          </select>
          
          <select
            className="bg-[var(--Background)] pr-10 pl-2 mr-2 text-[var(--Brown)] border border-gray-400 rounded-md hover:border-[var(--Brown)] focus:border-[var(--Brown)] focus:outline-none focus:ring-0 cursor-pointer"
            value={Subcat}
            onChange={handleSubCategories}
            disabled={cat === "Default"}
          >
            <option value="Default">ALL SUBCATEGORIES</option>
            {cat !== "Default" && subCategories[cat].map(subCat => (
              <option key={subCat} value={subCat}>
                {subCat.toUpperCase()}
              </option>
            ))}
          </select>
          
          <select
            className="bg-[var(--Background)] md:pr-10 md:pl-2 text-[var(--Brown)] border border-gray-400 rounded-md hover:border-[var(--Brown)] focus:border-[var(--Brown)] focus:outline-none focus:ring-0 cursor-pointer"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value={"Default"}>DEFAULT</option>
            <option value={"LowToHigh"}>PRICE: LOW TO HIGH</option>
            <option value={"HighToLow"}>PRICE: HIGH TO LOW</option>
          </select>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative w-3/4 my-3">
          <input
            type="text"
            className="w-full rounded-2xl py-1 px-3 border border-[var(--LightBrown)] text-md text-[var(--Brown)] min-h-10"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--Brown)]"></i>
        </div>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
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
  );
};

export default Collection;
