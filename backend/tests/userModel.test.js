import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Model", () => {
  it("should create a new user with valid data", async () => {
    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    };
    const savedUser = await userModel.create(userData);
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
  });
  it("should throw an error if email is already taken", async () => {
    const userData = {
      name: "Test User",
      email: "duplicate@example.com",
      password: "password123",
    };
    const user1 = new userModel(userData);
    await user1.save();
    const user2 = new userModel(userData);
    try {
      await user2.save();
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toMatch(/duplicate key error/);
    }
  });
  it("should require an email", async () => {
    const userData = {
      name: "Test User",
      password: "password123",
    };
    const user = new userModel(userData);
    try {
      await user.save();
    } catch (error) {
      expect(error.errors.email).toBeDefined();
      expect(error.errors.email.message).toBe("Path `email` is required.");
    }
  });
  it("should require a password", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
    };
    const user = new userModel(userData);
    try {
      await user.save();
    } catch (error) {
      expect(error.errors.password).toBeDefined();
      expect(error.errors.password.message).toBe(
        "Path `password` is required."
      );
    }
  });
  it("should not save a user with invalid email format", async () => {
    const userData = {
      name: "Test User",
      email: "invalid-email",
      password: "password123",
    };
    const user = new userModel(userData);
    try {
      await user.save();
    } catch (error) {
      expect(error.errors.email).toBeDefined();
      expect(error.errors.email.message).toBe(
        "Validator failed for path `email` with value `invalid-email`"
      );
    }
  });
});
