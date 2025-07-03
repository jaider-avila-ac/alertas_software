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

//
api.interceptors.request.use((config) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));


  if (
    !config.url.includes("/usuarios/login") &&
    !config.url.includes("/usuarios/generar") &&
    usuario?.token
  ) {
    config.headers.Authorization = `Bearer ${usuario.token}`;
  }

  return config;
});

export const get = (endpoint, config = {}) => api.get(endpoint, config);
export const post = (endpoint, data, config = {}) => api.post(endpoint, data, config);
export const put = (endpoint, data, config = {}) => api.put(endpoint, data, config);
export const del = (endpoint, config = {}) => api.delete(endpoint, config);
