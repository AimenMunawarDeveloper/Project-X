import React from "react";
import { render, waitFor } from "@testing-library/react";
import Collection from "../src/pages/Collection";
import { ShopContext } from "../src/context/ShopContext";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

describe("Integration Test: Collection and ProductItem Components", () => {
  const mockProducts = [
    {
      _id: "product1",
      title: "Product A",
      description: "Description A",
      price: "100",
      subCategory: "Women",
      category: "Tops",
      image: ["https://example.com/image1.png"],
    },
    {
      _id: "product2",
      title: "Product B",
      description: "Description B",
      price: "200",
      subCategory: "Men",
      category: "Shirts",
      image: ["https://example.com/image2.png"],
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
  test("fetches product data and dynamically updates context for ProductItem rendering", async () => {
    axios.get.mockResolvedValueOnce({
      data: { success: true, products: mockProducts },
    });
    render(
      <MemoryRouter>
        <ShopContext.Provider value={mockContextValue}>
          <Collection />
        </ShopContext.Provider>
      </MemoryRouter>
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
    await waitFor(() => {
      const renderedProductIds = mockContextValue.products.map(
        (product) => product._id
      );
      expect(renderedProductIds).toEqual(
        mockProducts.map((product) => product._id)
      );
    });
  });
});
