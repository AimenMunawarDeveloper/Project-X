import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../src/pages/Home";
import { ShopContext } from "../src/context/ShopContext";
import axios from "axios";

jest.mock("../src/Components/Hero", () => {
  const MockHero = () => <div>Hero Component</div>;
  MockHero.displayName = "Hero";
  return MockHero;
});
jest.mock("../src/Components/LatestCollection", () => {
  const MockLatestCollection = () => <div>Latest Collection Component</div>;
  MockLatestCollection.displayName = "LatestCollection";
  return MockLatestCollection;
});
jest.mock("../src/Components/BestSelling", () => {
  const MockBestSelling = () => <div>Best Selling Component</div>;
  MockBestSelling.displayName = "BestSelling";
  return MockBestSelling;
});
jest.mock("../src/Components/NewsLetter", () => {
  const MockNewsLetter = () => <div>NewsLetter Component</div>;
  MockNewsLetter.displayName = "NewsLetter";
  return MockNewsLetter;
});
jest.mock("axios");
describe("Home Component", () => {
  const mockProducts = [
    {
      _id: "product1",
      title: "Product A",
      price: "100",
      image: ["https://example.com/image1.png"],
      BestSell: true,
    },
    {
      _id: "product2",
      title: "Product B",
      price: "200",
      image: ["https://example.com/image2.png"],
      BestSell: false,
    },
  ];
  const mockContextValue = {
    products: [],
    backendUrl: "https://project-x-production-8d2d.up.railway.app/",
    loading: false,
    getProductsData: jest.fn(async () => {
      const response = await axios.get(
        `${mockContextValue.backendUrl}/api/product/list`
      );
      mockContextValue.products = response.data.products;
    }),
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("renders all child components", () => {
    render(
      <ShopContext.Provider value={mockContextValue}>
        <Home />
      </ShopContext.Provider>
    );
    expect(screen.getByText("Hero Component")).toBeInTheDocument();
    expect(screen.getByText("Latest Collection Component")).toBeInTheDocument();
    expect(screen.getByText("Best Selling Component")).toBeInTheDocument();
    expect(screen.getByText("NewsLetter Component")).toBeInTheDocument();
  });

  test("fetches products from API and updates context", async () => {
    axios.get.mockResolvedValueOnce({
      data: { success: true, products: mockProducts },
    });
    render(
      <ShopContext.Provider value={mockContextValue}>
        <Home />
      </ShopContext.Provider>
    );
    await mockContextValue.getProductsData();
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `${mockContextValue.backendUrl}/api/product/list`
      );
    });
    await waitFor(() => {
      expect(mockContextValue.products).toEqual(mockProducts);
    });
  });
});
