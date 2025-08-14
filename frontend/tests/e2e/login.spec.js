import { test, expect } from "@playwright/test";

test.describe("Login Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    console.log("Mock API called");

    // Mock login API
    await page.route(
      "https://project-x-production-8d2d.up.railway.app/api/user/login",
      (route) => {
        const { email, password } = JSON.parse(route.request().postData());
        if (email === "test@example.com" && password === "password123") {
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              success: true,
              token: "mock-token",
            }),
          });
        } else {
          route.fulfill({
            status: 401,
            contentType: "application/json",
            body: JSON.stringify({
              success: false,
              message: "Invalid credentials",
            }),
          });
        }
      }
    );

    // Mock sign-up API
    await page.route(
      "https://project-x-production-8d2d.up.railway.app/api/user/register",
      (route) => {
        const { email, password } = JSON.parse(route.request().postData());

        if (email === "existing@example.com") {
          route.fulfill({
            status: 400,
            contentType: "application/json",
            body: JSON.stringify({
              success: false,
              message: "User already exists",
            }),
          });
        } else if (password.length < 8) {
          route.fulfill({
            status: 400,
            contentType: "application/json",
            body: JSON.stringify({
              success: false,
              message: "Please enter a strong password",
            }),
          });
        } else {
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              success: true,
              token: "mock-token",
            }),
          });
        }
      }
    );

    await page.goto("http://localhost:5173/login");
  });

  test("should successfully log in with correct credentials", async ({
    page,
  }) => {
    await page.fill("input#email", "test@example.com");
    await page.fill("input#password", "password123");
    await page.click("button[type='submit']");

    await page.waitForURL("http://localhost:5173/");
    expect(page.url()).toBe("http://localhost:5173/");
  });

  test("should show error for invalid login credentials", async ({ page }) => {
    await page.fill("input#email", "wrong@example.com");
    await page.fill("input#password", "wrongpassword");
    await page.click("button[type='submit']");

    const errorToast = await page.locator(".Toastify__toast--error");
    await expect(errorToast).toContainText("Invalid credentials");
  });

  test("should switch to sign-up view and back to login", async ({ page }) => {
    await page.click("text=Create Account");
    const signUpTitle = await page.locator("h1:has-text('Sign up')");
    await expect(signUpTitle).toBeVisible();

    await page.click("text=Login");
    const loginTitle = await page.locator("h1:has-text('Login')");
    await expect(loginTitle).toBeVisible();
  });

  test("should successfully sign up with valid details", async ({ page }) => {
    await page.click("text=Create Account");

    await page.fill("input#name", "Test User");
    await page.fill("input#email", "test@example.com");
    await page.fill("input#password", "password123");
    await page.click("button[type='submit']");

    await page.waitForURL("http://localhost:5173/");
    expect(page.url()).toBe("http://localhost:5173/");
  });

  test("should show error for weak password during sign-up", async ({
    page,
  }) => {
    await page.click("text=Create Account");

    await page.fill("input#name", "Test User");
    await page.fill("input#email", "test@example.com");
    await page.fill("input#password", "short");
    await page.click("button[type='submit']");

    const errorToast = await page.locator(".Toastify__toast--error");
    await expect(errorToast).toContainText("Please enter a strong password");
  });

  test("should show error for existing email during sign-up", async ({
    page,
  }) => {
    await page.click("text=Create Account");

    await page.fill("input#name", "Test User");
    await page.fill("input#email", "existing@example.com");
    await page.fill("input#password", "password123");
    await page.click("button[type='submit']");
    const errorToast = await page.locator(".Toastify__toast--error");
    await expect(errorToast).toContainText("User already exists");
  });
});
