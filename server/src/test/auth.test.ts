import { describe, expect, test } from "@jest/globals";
import axios, { AxiosError } from "axios";
import { userData } from "./utils";

describe("Authentication", () => {
  test("User Signup", async () => {
    const response = await axios.post("http://localhost:8787/api/auth/signup", userData);

    expect(response.status).toBe(201);
  });

  test("User Signup with invalid data", async () => {
    try {
      await axios.post("http://localhost:8787/api/auth/signup", userData);
    } catch (error) {
      if (error instanceof AxiosError) {
        expect(error.response?.status).toBe(400);
      }
    }
  });

  test("User Sign with valid email and password", async () => {
    await axios.post("http://localhost:8787/api/auth/signup", userData);
    const response = await axios.post("http://localhost:8787/api/auth/signin", {
      email: userData.email,
      password: userData.password,
    });

    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("User Sign with invalid email and password", async () => {
    try {
      await axios.post("http://localhost:8787/api/auth/signin", {
        email: "somya",
        password: userData.password,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        expect(error.response?.status).toBe(400);
      }
    }
  });
});
