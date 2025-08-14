import { test, expect } from "@playwright/test";

test.describe("Product Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    console.log("Mock API called");

    await page.addInitScript(() => {
      window.localStorage.setItem("token", "mockToken123");
    });

    // Mock API for product list
    await page.route(
      "https://project-x-production-8d2d.up.railway.app/api/product/list",
      (route) => {
        console.log("Intercepting API call to /api/product/list");
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            products: Array(10)
              .fill(0)
              .map((_, i) => ({
                _id: `64bfc9c4b5e9fc00${i.toString().padStart(3, "0")}`,
                title: `Product ${i}`,
                description: `Description for Product ${i}`,
                price: (i + 1) * 100,
                category: i % 2 === 0 ? "Tops" : "Bottoms",
                subCategory:
                  i % 3 === 0 ? "Men" : i % 3 === 1 ? "Women" : "Kids",
                image: [`https://via.placeholder.com/150?text=Product${i}`],
                sizes: ["S", "M", "L", "XL"],
              })),
          }),
        });
      }
    );

    await page.route(
      "https://project-x-production-8d2d.up.railway.app/api/cart/add",
      (route) => {
        console.log("Intercepting API call to /api/cart/add");
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            message: "Added To Cart",
          }),
        });
      }
    );

    // Navigate to the specific product page
    await page.goto("http://localhost:5173/product/64bfc9c4b5e9fc00000");
  });

  test("should display product details correctly", async ({ page }) => {
    await page.waitForSelector("[data-testid='product-title']");

    const title = await page.locator("[data-testid='product-title']");
    const price = await page.locator("p.py-2.text-gray-600.text-lg");
    const description = await page.locator(
      "[data-testid='product-description']"
    );

    await expect(title).toHaveText("Product 0");
    await expect(price).toHaveText("Rs.100");
    await expect(description).toHaveText("Description for Product 0");
  });

  test("should add the product to the cart", async ({ page }) => {
    // Select size using unique selector
    const sizeButton = await page.locator("[data-testid='size-button-L']");
    await sizeButton.click();

    // Add to cart
    const addToCartButton = await page.locator(
      "button[aria-label='Add this item to your cart']"
    );
    await addToCartButton.click();

    // Check for toast notification
    const toastNotification = await page.locator(".Toastify__toast--success", {
      hasText: "Item successfully added to the cart",
    });
    await toastNotification.waitFor();
    await expect(toastNotification).toBeVisible();

    const cartCount = await page.locator("i.fa-cart-shopping > p");
    await expect(cartCount).toHaveText("1");
  });

  test("should display similar products", async ({ page }) => {
    const similarProducts = await page.locator(
      "[data-testid='similar-products'] .block.m-3"
    );

    await expect(similarProducts).toHaveCount(4); // Assuming 4 similar products
    const firstProduct = similarProducts.nth(0);
    await expect(firstProduct).toBeVisible();

    // Check the content of the first similar product
    const productTitle = await firstProduct.locator("h2.text-lg.font-semibold");
    await expect(productTitle).toContainText("Product");
  });
});
