import React from "react";
import { render, waitFor } from "@testing-library/react";
import Order from "../src/pages/Order";
import { ShopContext } from "../src/context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("Order Component (API Response Handling)", () => {
  const mockContextValue = {
    backendUrl: "https://project-x-production-8d2d.up.railway.app/",
    token: "mock-token",
    curr: "Rs",
  };

  const mockOrderData = [
    {
      _id: "order1",
      date: 1735118597664,
      paymentMethod: "stripe",
      status: "Order Placed",
      items: [
        {
          _id: "item1",
          title: "Product A",
          category: "Category A",
          price: 100,
          quantity: 1,
          size: "M",
          image: ["https://example.com/image1.png"],
        },
      ],
    },
  ];

  let originalLog;
  let originalError;

  beforeAll(() => {
    // Mock console.log and console.error
    originalLog = console.log;
    originalError = console.error;
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    // Restore original console functions
    console.log = originalLog;
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls API and processes response when orders are present", async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true, orders: mockOrderData },
    });

    render(
      <ShopContext.Provider value={mockContextValue}>
        <Order />
      </ShopContext.Provider>
    );

    await waitFor(() => {
      // Ensure the API was called correctly
      expect(axios.post).toHaveBeenCalledWith(
        `${mockContextValue.backendUrl}/api/order/userorders`,
        {},
        { headers: { token: mockContextValue.token } }
      );
    });

    // Ensure the response data is logged
    expect(console.log).toHaveBeenCalledWith(mockOrderData.reverse());
  });

  test("calls API and processes response when no orders are returned", async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true, orders: [] } });

    render(
      <ShopContext.Provider value={mockContextValue}>
        <Order />
      </ShopContext.Provider>
    );

    await waitFor(() => {
      // Ensure the API was called correctly
      expect(axios.post).toHaveBeenCalledWith(
        `${mockContextValue.backendUrl}/api/order/userorders`,
        {},
        { headers: { token: mockContextValue.token } }
      );
    });

    // Ensure empty data is logged
    expect(console.log).toHaveBeenCalledWith([]);
  });

  test("handles API errors gracefully", async () => {
    const mockError = new Error("Network Error");
    axios.post.mockRejectedValueOnce(mockError);

    render(
      <ShopContext.Provider value={mockContextValue}>
        <Order />
      </ShopContext.Provider>
    );

    await waitFor(() => {
      // Ensure the API was called correctly
      expect(axios.post).toHaveBeenCalledWith(
        `${mockContextValue.backendUrl}/api/order/userorders`,
        {},
        { headers: { token: mockContextValue.token } }
      );
    });

    // Ensure error is logged and toast is shown
    expect(console.error).toHaveBeenCalledWith(mockError);
    expect(toast.error).toHaveBeenCalledWith("Network Error");
  });
});
