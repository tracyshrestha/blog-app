import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com"; // mock API (replace with real later)

export const loginUser = async (credentials) => {
  // simulate JWT login
  const { email, password } = credentials;
  if (email === "admin@test.com" && password === "123456") {
    return {
      token: "fake-jwt-token",
      user: { id: 1, name: "Admin User", email },
    };
  }
  throw new Error("Invalid email or password");
};

export const registerUser = async (data) => {
  const response = await axios.post(`${API_URL}/users`, data);
  return response.data;
};
