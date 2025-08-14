import { test, expect } from "@playwright/test";

test.describe("Place Order Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set a mock token in local storage
    await page.addInitScript(() => {
      window.localStorage.setItem("token", "mockToken123");
    });

    // Mock API for placing an order
    await page.route(
      "https://project-x-production-8d2d.up.railway.app//api/order/place",
      (route) => {
        console.log("Intercepting API call to /api/order/place");
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, message: "Order Placed" }),
        });
      }
    );

    // Mock cart and product data
    await page.route(
      "https://project-x-production-8d2d.up.railway.app//api/cart/get",
      (route) => {
        console.log("Intercepting API call to /api/cart/get");
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            cartData: {
              "6768ffd6ad9c9ad645022b9d": { M: 1 },
              "64bfc9c4b5e9fc00002": { L: 2 },
            },
          }),
        });
      }
    );

    await page.route(
      "https://project-x-production-8d2d.up.railway.app//api/product/list",
      (route) => {
        console.log("Intercepting API call to /api/product/list");
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            products: [
              {
                _id: "6768ffd6ad9c9ad645022b9d",
                title: "Product A",
                price: 34,
                category: "Women",
                image: ["https://via.placeholder.com/150?text=ProductA"],
              },
              {
                _id: "64bfc9c4b5e9fc00002",
                title: "Product B",
                price: 50,
                category: "Men",
                image: ["https://via.placeholder.com/150?text=ProductB"],
              },
            ],
          }),
        });
      }
    );

    // Navigate to the Place Order page
    await page.goto("http://localhost:5173/PlaceOrder");
  });

  test("should display shipping information form", async ({ page }) => {
    await page.waitForSelector("h1", { hasText: "Shipping Information" });

    // Verify all form fields are rendered
    const formFields = [
      "fname",
      "lname",
      "email",
      "street",
      "city",
      "state",
      "zipcode",
      "country",
      "phone",
    ];
    for (const field of formFields) {
      await expect(page.locator(`input[name='${field}']`)).toBeVisible();
    }
  });

  test("should validate shipping form before placing an order", async ({
    page,
  }) => {
    await page.click("button:has-text('Place Order')");

    // Verify error toast for missing shipping details
    await expect(page.locator(".Toastify__toast--error")).toHaveText(
      "Please fill in all valid shipping details."
    );
  });

  test("should allow payment method selection", async ({ page }) => {
    const stripeOption = page.locator("[data-testid='payment-method-stripe']");
    const razorpayOption = page.locator(
      "[data-testid='payment-method-razorpay']"
    );
    const codOption = page.locator("[data-testid='payment-method-cod']");

    // Select Stripe
    await stripeOption.click();
    await expect(stripeOption).toHaveClass(/border-\[var\(--Pink\)\]/);

    // Select Razorpay
    await razorpayOption.click();
    await expect(razorpayOption).toHaveClass(/border-\[var\(--Pink\)\]/);

    // Select Cash on Delivery
    await codOption.click();
    await expect(codOption).toHaveClass(/border-\[var\(--Pink\)\]/);
  });

  test("should calculate total amount correctly", async ({ page }) => {
    const totalAmount = page.locator("[data-testid='total-amount']");

    // Wait for the total to be updated
    await expect(totalAmount).toHaveText("Rs134.00"); // Rs.34 + Rs.50

    // Select COD (adds delivery charges)
    await page.locator("[data-testid='payment-method-cod']").click();
    await expect(totalAmount).toHaveText("Rs334.00"); // Rs.134 + Rs.200 (delivery charges)
  });

  test("should place an order successfully", async ({ page }) => {
    // Fill out the form
    await page.fill("input[name='fname']", "John");
    await page.fill("input[name='lname']", "Doe");
    await page.fill("input[name='email']", "john.doe@example.com");
    await page.fill("input[name='street']", "123 Elm St");
    await page.fill("input[name='city']", "Metropolis");
    await page.fill("input[name='state']", "IL");
    await page.fill("input[name='zipcode']", "12345");
    await page.fill("input[name='country']", "USA");
    await page.fill("input[name='phone']", "1234567890");

    // Click Place Order
    page.click("button:has-text('Place Order')");
    // Verify success toast
    await expect(page.locator(".Toastify__toast--success")).toHaveText(
      "Order placed successfully!"
    );

    // Verify navigation to the order confirmation page
    await expect(page).toHaveURL("http://localhost:5173/Order");
  });
});
