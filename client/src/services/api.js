import axios from "axios";
import { refreshToken } from "./auth";

const API = axios.create({
 baseURL: "https://prodify-ezmo.onrender.com/api",
  withCredentials: true,
});

// 🔐 attach access token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 🔄 auto refresh token on 401
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await refreshToken();

        // save new token
        localStorage.setItem("token", res.data.accessToken);

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return API(originalRequest);

      } catch (err) {
        // refresh failed → logout
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default API;