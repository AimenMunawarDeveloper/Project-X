import React from "react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../Components/ProductItem";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Product = () => {
  const { ProductId } = useParams();
  const { products, curr, addingAnItemToTheCart } = useContext(ShopContext);
  const [isData, setIsData] = useState(null);
  const [image, setImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  console.log(ProductId);

  useEffect(() => {
    const fetchingData = async () => {
      if (products.length > 0) {
        const foundItem = products.find((item) => item._id === ProductId);
        if (foundItem) {
          setIsData(foundItem);
          setImage(foundItem.image);
        }
        setIsLoading(false);
      }
    };
    fetchingData();
  }, [ProductId, products]);

  if (isLoading) {
    return <div>Loading product details...</div>;
  }

  if (!isData) {
    return <div>Product not found</div>;
  }

  const getSimilarProducts = (category) => {
    return products.filter(
      (item) => item.category === category && item._id !== isData._id
    );
  };

  const handleImageClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page smoothly
  };

  return isData ? (
    <div className="bg-white">
      <div className="block lg:flex">
        <div className="lg:w-2/4">
          <TransformWrapper>
            <TransformComponent
              wrapperStyle={{
                height: "100%",
                width: "100%",
              }}
              contentStyle={{
                height: "100%",
                width: "100%",
              }}
            >
              <img
                src={image}
                alt={isData.title}
                className=" aspect-[4/5] w-full md:aspect-[5/3]"
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
        <div className=" lg:w-2/4 p-10">
          <h1
            className="text-[var(--Pink)] text-3xl font-bold pb-2 pt-5 lg:pt-0"
            data-testid="product-title"
          >
            {isData.title}
          </h1>
          <hr />
          <p className="py-2 text-gray-600 text-lg" data-testid="product-price">
            {`${curr}.${isData.price}`}
          </p>

          <p className="py-2 text-gray-600 text-md">
            Category: {isData.category}
          </p>
          <p className="py-2 text-gray-600 text-md">
            SubCategory: {isData.subCategory}
          </p>

          <div className="mt-10">
            <h1 className="text-2xl font-bold text-gray-500">Select Size</h1>
            <div className="flex flex-wrap gap-3 my-6">
              {isData.sizes.map((size, index) => {
                return (
                  <button
                    key={index}
                    className={`p-2 border rounded-md text-lg text-gray-500 hover:bg-[var(--Pink)] hover:text-white cursor-pointer hover:scale-105 transition-all ${
                      size === selectedSize ? "border-[var(--Primary)]" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                    data-testid={`size-button-${size}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            className="py-2 mt-5 mb-5 px-4 border bg-[var(--)] rounded-3xl text-lg font-bold text-white hover:bg--700 cursor-pointer hover:scale-105 transition-all"
            onClick={() => addingAnItemToTheCart(ProductId, selectedSize)}
            aria-label="Add this item to your cart"
          >
            Add to Cart
          </button>
          <h3 className="text-[var(--Brown)] text-2xl font-bold pb-2 pt-5 lg:pt-0">
            Description:
          </h3>
          <p
            className="text-[var(--Brown)] text-xl"
            data-testid="product-description"
          >
            {isData.description}
          </p>

          <ul className="text-[var(--Brown)] text-lg list-disc pb-8 mx-6 my-10">
            <li>Guaranteed Original Product</li>
            <li>Cash on delivery or card</li>
            <li>Return of product within a week</li>
          </ul>
        </div>
      </div>

      <div className="p-10">
        <p className="font-bold text-2xl text-[var(--)]">Reviews(144)</p>
        <div className="text-gray-500 bg-white p-5 mt-5 rounded-md shadow-md hover:scale-[1.02] transition-all">
          <p className="text-justify text-lg">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Labore,
            nam. Odit, aliquid perferendis autem beatae est cum repudiandae
            dignissimos voluptas magnam vitae et ducimus tempora cupiditate,
            unde, fugiat quidem voluptates.
          </p>
        </div>
        <div className="text-gray-500 bg-white p-5 mt-5 rounded-md shadow-md hover:scale-[1.02] transition-all">
          <p className="text-justify text-lg">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Labore,
            nam. Odit, aliquid perferendis autem beatae est cum repudiandae
            dignissimos voluptas magnam vitae et ducimus tempora cupiditate,
            unde, fugiat quidem voluptates.
          </p>
        </div>
      </div>

      <h1 className="font-bold text-3xl text-center text-[var(--)] py-10">
        You May Also Like...
      </h1>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        data-testid="similar-products"
      >
        {getSimilarProducts(isData.category).map((similarProduct) => (
          <div key={similarProduct._id} onClick={handleImageClick}>
            <ProductItem
              id={similarProduct._id}
              title={similarProduct.title}
              image={similarProduct.image}
              price={similarProduct.price.toString()}
            />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div>No results Found</div>
  );
};

export default Product;
