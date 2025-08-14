import { test, expect } from "@playwright/test";

test.describe("Order Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    console.log("Mock API called");

    await page.route(
      "https://project-x-production-8d2d.up.railway.app//api/order/userorders",
      (route) => {
        const { token } = route.request().headers();
        if (token === "valid-token") {
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              success: true,
              orders: [
                {
                  _id: "order2",
                  date: "2023-11-30T15:30:00Z",
                  paymentMethod: "PayPal",
                  status: "Pending",
                  items: [
                    {
                      _id: "item2",
                      title: "Product 2",
                      category: "Category 2",
                      price: 200,
                      quantity: 1,
                      size: "L",
                      image: ["https://via.placeholder.com/150"],
                    },
                  ],
                },
                {
                  _id: "order1",
                  date: "2023-12-01T10:00:00Z",
                  paymentMethod: "Credit Card",
                  status: "Delivered",
                  items: [
                    {
                      _id: "item1",
                      title: "Product 1",
                      category: "Category 1",
                      price: 100,
                      quantity: 2,
                      size: "M",
                      image: ["https://via.placeholder.com/150"],
                    },
                  ],
                },
              ],
            }),
          });
        } else {
          route.fulfill({
            status: 401,
            contentType: "application/json",
            body: JSON.stringify({
              success: false,
              message: "Unauthorized",
            }),
          });
        }
      }
    );

    await page.goto("http://localhost:5173/order");
  });

  test("should display a message when there are no orders", async ({
    page,
  }) => {
    await page.route(
      "https://project-x-production-8d2d.up.railway.app//api/order/userorders",
      (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, orders: [] }),
        });
      }
    );

    await page.reload();
    const noOrdersMessage = page.locator("text=No orders to display.");
    await expect(noOrdersMessage).toBeVisible();
  });

  test("should display the user's orders", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem("token", "valid-token");
    });

    await page.reload();

    const ordersLocator = page.locator(
      ".bg-white.rounded-md.shadow-md.p-5.mb-5"
    );
    await ordersLocator.first().waitFor({ timeout: 15000 });

    await expect(ordersLocator).toHaveCount(2);

    const firstOrder = ordersLocator.nth(0);
    await expect(firstOrder).toContainText("Order Number: #1");
    await expect(firstOrder).toContainText("Delivered");
    await expect(firstOrder).toContainText("Credit Card");
    await expect(firstOrder).toContainText("Product 1");
    await expect(firstOrder).toContainText("Category 1");

    const secondOrder = ordersLocator.nth(1);
    await expect(secondOrder).toContainText("Order Number: #2");
    await expect(secondOrder).toContainText("Pending");
    await expect(secondOrder).toContainText("PayPal");
    await expect(secondOrder).toContainText("Product 2");
    await expect(secondOrder).toContainText("Category 2");
  });
});
