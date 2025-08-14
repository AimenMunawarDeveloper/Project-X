import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Product from "../src/pages/Product";
import { ShopContext } from "../src/context/ShopContext";

// Mock products data
const mockProducts = [
  {
    _id: "product-1",
    title: "Product 1",
    category: "Tops",
    price: 100,
    image: "image1.jpg",
    sizes: ["M", "L"],
    description: "Description of Product 1",
  },
  {
    _id: "product-2",
    title: "Product 2",
    category: "Tops",
    price: 150,
    image: "image2.jpg",
    sizes: ["S", "M"],
    description: "Description of Product 2",
  },
];

// Mock ShopContext value
const mockContextValue = {
  products: mockProducts,
  curr: "Rs",
  addingAnItemToTheCart: jest.fn(),
};

const renderWithRouter = (ui, route = "/product/product-1") => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ShopContext.Provider value={mockContextValue}>
        <Routes>
          <Route path="/product/:ProductId" element={ui} />
        </Routes>
      </ShopContext.Provider>
    </MemoryRouter>
  );
};

describe("Product Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays product details correctly", async () => {
    await act(async () => {
      renderWithRouter(<Product />);
    });

    // Wait for product details to load and verify content
    expect(await screen.findByTestId("product-title")).toHaveTextContent(
      "Product 1"
    );
    expect(await screen.findByTestId("product-description")).toHaveTextContent(
      "Description of Product 1"
    );

    // Match price in a single node
    expect(screen.getByTestId("product-price")).toHaveTextContent("Rs.100");
  });

  test("renders similar products", async () => {
    await act(async () => {
      renderWithRouter(<Product />);
    });

    const similarProducts = screen.getByTestId("similar-products");
    expect(similarProducts).toBeInTheDocument();
    expect(similarProducts.children.length).toBe(1); // Only one other product in the same category
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  test("handles product not found", async () => {
    await act(async () => {
      renderWithRouter(<Product />, "/product/non-existent-product");
    });

    expect(screen.getByText("Product not found")).toBeInTheDocument();
  });

  test("handles size selection and adds item to cart", async () => {
    await act(async () => {
      renderWithRouter(<Product />);
    });

    // Select size
    const sizeButtonM = screen.getByTestId("size-button-M");
    act(() => {
      sizeButtonM.click();
    });
    expect(sizeButtonM).toHaveClass("border--600");

    // Add to cart using `aria-label`
    const addToCartButton = screen.getByLabelText("Add this item to your cart");
    act(() => {
      addToCartButton.click();
    });

    expect(mockContextValue.addingAnItemToTheCart).toHaveBeenCalledWith(
      "product-1",
      "M"
    );
  });
});
