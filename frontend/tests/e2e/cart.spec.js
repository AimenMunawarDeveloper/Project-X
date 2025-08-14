import { test, expect } from "@playwright/test";

test.describe("Cart Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set a mock token in local storage
    await page.addInitScript(() => {
      window.localStorage.setItem("token", "mockToken123");
    });

    // Mock API for fetching cart data
    await page.route(
      "https://project-x-production-8d2d.up.railway.app/api/cart/get",
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

    // Mock API for fetching product list
    await page.route(
      "https://project-x-production-8d2d.up.railway.app/api/product/list",
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
                description: "Description for Product A",
                price: 34,
                category: "Women",
                image: ["https://via.placeholder.com/150?text=ProductA"],
              },
              {
                _id: "64bfc9c4b5e9fc00002",
                title: "Product B",
                description: "Description for Product B",
                price: 50,
                category: "Men",
                image: ["https://via.placeholder.com/150?text=ProductB"],
              },
            ],
          }),
        });
      }
    );

    await page.route(
      "https://project-x-production-8d2d.up.railway.app/api/cart/update",
      (route) => {
        console.log("Intercepting API call to /api/cart/update");
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, message: "Cart Updated" }),
        });
      }
    );

    await page.route(
      "https://project-x-production-8d2d.up.railway.app/api/cart/delete",
      (route) => {
        console.log("Intercepting API call to /api/cart/delete");
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            message: "Product removed from cart",
          }),
        });
      }
    );

    // Navigate to the Cart page
    await page.goto("http://localhost:5173/Cart");
  });

  test("should display cart items correctly", async ({ page }) => {
    await page.waitForSelector("h1", { hasText: "Shopping Bag" });

    // Check that two items are rendered
    const cartItems = await page.locator("[data-testid^='cart-item-row']");
    await expect(cartItems).toHaveCount(2);

    // Verify first item's details
    await expect(
      page.locator("[data-testid='cart-item-title-6768ffd6ad9c9ad645022b9d-M']")
    ).toHaveText("Product A");
    await expect(
      page.locator("[data-testid='quantity-input-6768ffd6ad9c9ad645022b9d-M']")
    ).toHaveValue("1");

    // Verify second item's details
    await expect(
      page.locator("[data-testid='cart-item-title-64bfc9c4b5e9fc00002-L']")
    ).toHaveText("Product B");
    await expect(
      page.locator("[data-testid='quantity-input-64bfc9c4b5e9fc00002-L']")
    ).toHaveValue("2");
  });

  test("should update item quantity correctly", async ({ page }) => {
    const quantityInput = page.locator(
      "[data-testid='quantity-input-6768ffd6ad9c9ad645022b9d-M']"
    );

    // Simulate user interaction to update the quantity
    await quantityInput.click();
    await quantityInput.fill("3"); // Change the quantity

    // Verify updated value in the input field
    await expect(quantityInput).toHaveValue("3");
  });

  test("should remove an item correctly", async ({ page }) => {
    const deleteIcon = page.locator(
      "[data-testid='delete-icon-6768ffd6ad9c9ad645022b9d-M']"
    );
    await deleteIcon.click();

    // Verify the item is removed
    const cartItems = page.locator(
      "[data-testid='cart-item-row-6768ffd6ad9c9ad645022b9d-M']"
    );
    await expect(cartItems).toHaveCount(0);

    const toastNotification = await page.locator(".Toastify__toast--success", {
      hasText: "Item successfully removed from the cart",
    });
    await toastNotification.waitFor();
    await expect(toastNotification).toBeVisible();
  });

  test("should calculate total price correctly", async ({ page }) => {
    const totalAmount = page.locator("[data-testid='total-amount']");

    // Verify the total amount matches the expected calculation
    await expect(totalAmount).toHaveText("Rs334.00");
  });

  test("should navigate to place order page on clicking place orders", async ({
    page,
  }) => {
    const placeOrderButton = page.locator("button", {
      hasText: "Place Orders",
    });
    await placeOrderButton.click();

    // Verify navigation
    await expect(page).toHaveURL("http://localhost:5173/PlaceOrder");
  });
});
