import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Cart from "../src/pages/Cart";
import { ShopContext } from "../src/context/ShopContext";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockProducts = [
  {
    _id: "product-1",
    title: "Product 1",
    category: "Tops",
    price: 100,
    image: "image1.jpg",
  },
];

const mockCart = {
  "product-1": {
    M: 2,
    L: 1,
  },
};

const mockContextValue = {
  products: mockProducts,
  cart: mockCart,
  curr: "Rs",
  updateQuantity: jest.fn(),
  deleteProductFromCart: jest.fn(),
  backendUrl: "https://project-x-production-8d2d.up.railway.app",
};

const renderWithContext = (component) => {
  return render(
    <BrowserRouter>
      <ShopContext.Provider value={mockContextValue}>
        {component}
      </ShopContext.Provider>
    </BrowserRouter>
  );
};

describe("Cart Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays cart items correctly", async () => {
    axios.get.mockResolvedValueOnce({
      data: { success: true, products: mockProducts },
    });

    await act(async () => {
      renderWithContext(<Cart />);
    });

    expect(screen.getByTestId(`cart-item-title-product-1-M`)).toHaveTextContent(
      "Product 1"
    );
    expect(screen.getByTestId(`cart-item-size-product-1-M`)).toHaveTextContent(
      "Size: M"
    );
    expect(screen.getByTestId(`cart-item-size-product-1-L`)).toHaveTextContent(
      "Size: L"
    );
    expect(
      screen.getByTestId(`cart-item-category-product-1-M`)
    ).toHaveTextContent("Tops");
  });

  test("updates quantity correctly", async () => {
    renderWithContext(<Cart />);

    const quantityInput = screen.getByTestId("quantity-input-product-1-M");
    fireEvent.change(quantityInput, { target: { value: "3" } });

    expect(mockContextValue.updateQuantity).toHaveBeenCalledWith(
      "product-1",
      "M",
      3
    );
  });

  test("deletes item from cart", async () => {
    renderWithContext(<Cart />);

    const deleteButton = screen.getByTestId("delete-icon-product-1-M");
    fireEvent.click(deleteButton);

    expect(mockContextValue.deleteProductFromCart).toHaveBeenCalledWith(
      "product-1",
      "M"
    );
  });

  test("navigates to place order page", () => {
    renderWithContext(<Cart />);

    const placeOrderButton = screen.getByText("Place Orders");
    fireEvent.click(placeOrderButton);

    expect(mockNavigate).toHaveBeenCalledWith("/PlaceOrder");
  });

  test("shows empty cart message", () => {
    const emptyContext = {
      ...mockContextValue,
      cart: {},
    };

    render(
      <BrowserRouter>
        <ShopContext.Provider value={emptyContext}>
          <Cart />
        </ShopContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText("Cart is empty")).toBeInTheDocument();
  });

  test("calculates total correctly", async () => {
    await act(async () => {
      renderWithContext(<Cart />);
    });

    const prices = screen.getAllByTestId(/cart-item-price/);
    prices.forEach((price) => {
      expect(price.textContent).toBe("Rs.100");
    });
  });
});
