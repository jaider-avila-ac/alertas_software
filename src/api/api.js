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

// Interceptor para añadir el token si existe
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

// Interceptor para detectar expiración de token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("usuario");
      window.location.href = "/login"; // Redirige al login si expira el token
    }
    return Promise.reject(error);
  }
);

// Exportar funciones para usar en servicios
export const get = (endpoint, config = {}) => api.get(endpoint, config);
export const post = (endpoint, data, config = {}) => api.post(endpoint, data, config);
export const put = (endpoint, data, config = {}) => api.put(endpoint, data, config);
export const del = (endpoint, config = {}) => api.delete(endpoint, config);
