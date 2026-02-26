import axios from "axios";
import { jwtDecode } from "jwt-decode"; 

let accessToken = null;

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token); // Corrected name
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true; 
  }
};

api.interceptors.request.use(async (config) => {
  if (config.url === "/refresh-token" || config.url === "/logout") {
    return config;
  }

  if (accessToken && isTokenExpired(accessToken)) {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/refresh-token",
        {},
        { withCredentials: true }
      );
      accessToken = res.data.accessToken;
    } catch (err) {
      console.error("Refresh token failed:", err);
      accessToken = null; 
    }
  }

  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

export const setToken = (token) => {
  accessToken = token;
};

export default api;