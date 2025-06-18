import axios from "axios";

const API_BASE_URL = "http://localhost:8085/api"; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Métodos genéricos
export const get = (endpoint) => api.get(endpoint);
export const post = (endpoint, data) => api.post(endpoint, data);
export const put = (endpoint, data) => api.put(endpoint, data);
export const del = (endpoint) => api.delete(endpoint);
