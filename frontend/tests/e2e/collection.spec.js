import { test, expect } from "@playwright/test";

test.describe("Collection Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    console.log("Mock API called");

    // Mock API for product list
    await page.route(
      "https://project-x-production-8d2d.up.railway.app//api/product/list",
      (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            products: [
              {
                _id: "prod1",
                title: "Product A",
                description: "A description",
                price: 100,
                category: "Tops",
                subCategory: "Men",
                image: ["https://via.placeholder.com/150"],
              },
              {
                _id: "prod2",
                title: "Product B",
                description: "B description",
                price: 200,
                category: "Bottoms",
                subCategory: "Women",
                image: ["https://via.placeholder.com/150"],
              },
              {
                _id: "prod3",
                title: "Product C",
                description: "C description",
                price: 50,
                category: "Shirts",
                subCategory: "Kids",
                image: ["https://via.placeholder.com/150"],
              },
            ],
          }),
        });
      }
    );

    // Navigate to the collection page
    await page.goto("http://localhost:5173/collection");
    await page.waitForSelector("[data-testid='product-collection']"); // Wait for product grid
  });

  test("should display all products by default", async ({ page }) => {
    const productA = page.locator("[data-testid='product-prod1']");
    const productB = page.locator("[data-testid='product-prod2']");
    const productC = page.locator("[data-testid='product-prod3']");

    await expect(productA).toContainText("Product A");
    await expect(productB).toContainText("Product B");
    await expect(productC).toContainText("Product C");
  });

  test("should filter products based on search query", async ({ page }) => {
    await page.locator('input[placeholder="Search..."]').fill("Product B");
    await page.waitForTimeout(300); // Ensure state update and DOM rendering
    const productItems = page.locator(
      ".block.m-3.p-2.border.rounded-md.shadow-md"
    );
    // await expect(productItems).toHaveCount(1);
    await expect(productItems.first()).toContainText("Product B");
  });

  test("should sort products by price (Low to High)", async ({ page }) => {
    await page.locator("select").nth(2).selectOption("LowToHigh");
    await page.waitForTimeout(300); // Ensure sorting and DOM rendering
    const productItems = page.locator(
      ".block.m-3.p-2.border.rounded-md.shadow-md"
    );
    await expect(productItems.nth(0)).toContainText("Product C"); // Lowest price first
    await expect(productItems.nth(1)).toContainText("Product A");
    await expect(productItems.nth(2)).toContainText("Product B");
  });

  test("should filter products by category and subcategory", async ({
    page,
  }) => {
    await page.locator("select").nth(1).selectOption("Tops"); // Filter by category
    await page.waitForTimeout(300); // Allow DOM updates
    const productItems = page.locator(
      ".block.m-3.p-2.border.rounded-md.shadow-md"
    );
    // await expect(productItems).toHaveCount(1);
    await expect(productItems.first()).toContainText("Product A");
  });
});
