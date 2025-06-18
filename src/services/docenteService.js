import { get, post, put, del } from "../api/api";

const base = "/docentes";

export const obtenerTodosDocentes = () => get(base);
export const obtenerDocentePorId = (id) => get(`${base}/${id}`);
export const buscarDocente = (params) => get(`${base}/buscar?${params}`);
export const crearDocente = (data) => post(base, data);
export const actualizarDocente = (id, data) => put(`${base}/${id}`, data);
export const eliminarDocente = (id) => del(`${base}/${id}`);
export const totalDocentes = () => get(`${base}/total`);
