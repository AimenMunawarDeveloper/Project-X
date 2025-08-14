import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import PlaceOrder from "../src/pages/PlaceOrder";
import { ShopContext } from "../src/context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
jest.mock("axios");
axios.post = jest.fn();

test("submits an order successfully", async () => {
  const mockContextValue = {
    cart: { product1: { M: 2, L: 1 } },
    totalAmount: 1000,
    backendUrl: "https://project-x-production-8d2d.up.railway.app/",
    token: "mock-token",
    Delivery_charges: 200,
    products: [{ _id: "product1", price: 500 }],
    setCart: jest.fn(),
    setNumberOfItemsInCart: jest.fn(),
    navigate: jest.fn(),
  };
  axios.post.mockResolvedValue({
    data: { success: true },
  });
  const { getByText, getByLabelText } = render(
    <ShopContext.Provider value={mockContextValue}>
      <PlaceOrder />
    </ShopContext.Provider>
  );
  fireEvent.change(getByLabelText(/First Name/i), {
    target: { value: "John" },
  });
  fireEvent.change(getByLabelText(/Last Name/i), { target: { value: "Doe" } });
  fireEvent.change(getByLabelText(/Email Address/i), {
    target: { value: "john.doe@example.com" },
  });
  fireEvent.change(getByLabelText(/Street Address/i), {
    target: { value: "123 Main St" },
  });
  fireEvent.change(getByLabelText(/City/i), {
    target: { value: "Springfield" },
  });
  fireEvent.change(getByLabelText(/State/i), { target: { value: "IL" } });
  fireEvent.change(getByLabelText(/ZipCode/i), { target: { value: "62704" } });
  fireEvent.change(getByLabelText(/Country/i), { target: { value: "USA" } });
  fireEvent.change(getByLabelText(/Phone Number/i), {
    target: { value: "1234567890" },
  });
  fireEvent.click(getByText(/Place Order/i));
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "https://project-x-production-8d2d.up.railway.app//api/order/place",
      expect.objectContaining({
        address: expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          street: "123 Main St",
          city: "Springfield",
          state: "IL",
          zipcode: "62704",
          country: "USA",
          phone: "1234567890",
        }),
        items: expect.arrayContaining([
          expect.objectContaining({ _id: "product1", size: "M", quantity: 2 }),
          expect.objectContaining({ _id: "product1", size: "L", quantity: 1 }),
        ]),
        paymentMethod: "stripe",
        amount: 1000,
      }),
      expect.objectContaining({
        headers: { token: "mock-token" },
      })
    );
  });
});
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));
test("shows an error if shipping details are incomplete", async () => {
  const mockContextValue = {
    cart: { product1: { M: 2 } },
    totalAmount: 1000,
    backendUrl: "https://project-x-production-8d2d.up.railway.app/",
    token: "mock-token",
    Delivery_charges: 200,
    products: [{ _id: "product1", price: 500 }],
  };

  const { getByText, getByLabelText } = render(
    <ShopContext.Provider value={mockContextValue}>
      <PlaceOrder />
    </ShopContext.Provider>
  );

  // Fill in only one field
  fireEvent.change(getByLabelText(/First Name/i), {
    target: { value: "John" },
  });

  // Submit the form
  fireEvent.click(getByText(/Place Order/i));

  // Assert the toast error message
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith(
      "Please fill in all valid shipping details.",
      expect.any(Object)
    );
  });
});
