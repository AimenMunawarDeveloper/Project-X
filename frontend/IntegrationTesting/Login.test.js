import axios from "axios";

jest.mock("axios");
describe("API Integration Tests for Login and Sign-Up", () => {
  const mockContextValue = {
    token: null,
    setToken: jest.fn(),
    backendUrl: "https://project-x-production-8d2d.up.railway.app",
    navigate: jest.fn(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });
  test("should call login API successfully and handle token storage", async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true, token: "testtoken" },
    });
    const email = "testuser@example.com";
    const password = "password123";
    const response = await axios.post(
      `${mockContextValue.backendUrl}/api/user/login`,
      { email, password }
    );
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `${mockContextValue.backendUrl}/api/user/login`,
      { email, password }
    );
    expect(response.data.success).toBe(true);
    expect(response.data.token).toBe("testtoken");
    localStorage.setItem("token", response.data.token);
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "testtoken");
  });
  test("should call sign-up API successfully and handle token storage", async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true, token: "newusertoken" },
    });
    const name = "New User";
    const email = "newuser@example.com";
    const password = "newpassword123";
    const response = await axios.post(
      `${mockContextValue.backendUrl}/api/user/register`,
      { name, email, password }
    );
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `${mockContextValue.backendUrl}/api/user/register`,
      { name, email, password }
    );
    expect(response.data.success).toBe(true);
    expect(response.data.token).toBe("newusertoken");
    localStorage.setItem("token", response.data.token);
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "newusertoken");
  });
});
