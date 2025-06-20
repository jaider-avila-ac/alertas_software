import { get, post, put, del } from "../api/api";

const base = "/estudiantes";

export const obtenerTodosEstudiantes = () => get(base);
export const obtenerEstudiantePorId = (id) => get(`${base}/${id}`);
export const buscarEstudiante = (valor) => get(`/estudiantes/buscar?valor=${valor}`);
export const crearEstudiante = (data) => post(base, data);
export const actualizarEstudiante = (id, data) => put(`${base}/${id}`, data);
export const eliminarEstudiante = (id) => del(`${base}/${id}`);
export const totalEstudiantes = () => get(`${base}/total`);
