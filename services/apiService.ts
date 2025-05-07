import axios from "axios";
// import { API_BASE_URL } from "@env";

// const API_BASE_URL = "http://192.168.0.106:8080/api";
// home
const API_BASE_URL = "http://192.168.0.110:8080/api";

const apiService = axios.create({
  baseURL: API_BASE_URL,
});

apiService.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    console.error("Error in request:", error);
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => {
    console.log("Received response from:", response.config.url);
    return response;
  },
  (error) => {
    console.error("Error in response:", error);
    return Promise.reject(error);
  }
);

export default apiService;