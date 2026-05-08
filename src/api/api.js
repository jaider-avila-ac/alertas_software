import axios from "axios";

const API_BASE_URL = "https://alertas-soft.onrender.com/api";

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

// Interceptor para detectar expiración de token (solo 401 = token inválido/expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Exportar funciones para usar en servicios
export const get = (endpoint, config = {}) => api.get(endpoint, config);
export const post = (endpoint, data, config = {}) => api.post(endpoint, data, config);
export const put = (endpoint, data, config = {}) => api.put(endpoint, data, config);
export const del = (endpoint, config = {}) => api.delete(endpoint, config);
