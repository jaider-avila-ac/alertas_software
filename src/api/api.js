import axios from "axios";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8085/api"
    : `http://${window.location.hostname}:8085/api`;


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Métodos genéricos
export const get = (endpoint, config = {}) => api.get(endpoint, config);

export const post = (endpoint, data, config = {}) => api.post(endpoint, data, config);

export const put = (endpoint, data) => api.put(endpoint, data);
export const del = (endpoint) => api.delete(endpoint);
