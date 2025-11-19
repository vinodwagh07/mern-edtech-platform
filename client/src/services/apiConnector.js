import axios from "axios";

// Create a reusable Axios instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // must point to backend
  timeout: 10000,
  withCredentials: true,
});

// Generic API connector function
export const apiConnector = async (method, url, bodyData, headers, params) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data: bodyData || null,
      headers: headers || {},
      params: params || {},
    });
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
