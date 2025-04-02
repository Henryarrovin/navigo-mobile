import axios from "axios";

const API_BASE_URL = "http://192.168.0.106:8080/api";
// const API_BASE_URL = "http://192.168.137.178:8080/api";

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