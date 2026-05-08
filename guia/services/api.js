import axios from "axios";
import { API_BASE_URL } from "../config/config";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Token inyectado dinámicamente (se setea desde AuthContext)
let _token = null;
let _onUnauthorized = null;

export function setApiToken(token) {
  _token = token;
}

export function getApiToken() {
  return _token;
}

export function setUnauthorizedHandler(fn) {
  _onUnauthorized = fn;
}

api.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && _onUnauthorized) {
      _onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export const get  = (endpoint, cfg = {}) => api.get(endpoint, cfg);
export const post = (endpoint, data, cfg = {}) => api.post(endpoint, data, cfg);
export const put  = (endpoint, data, cfg = {}) => api.put(endpoint, data, cfg);
export const del  = (endpoint, cfg = {}) => api.delete(endpoint, cfg);
export const patch = (endpoint, data, cfg = {}) => api.patch(endpoint, data, cfg);