import { get, post, put, del } from "../api/api";

const base = "/consultas";

export const obtenerTodasConsultas = () => get(base);
export const obtenerConsultaPorId = (id) => get(`${base}/${id}`);
export const buscarConsultaPorMotivo = (motivo) => get(`${base}/buscar?motivo=${motivo}`);
export const buscarConsultaPorEstudiante = (id) => get(`${base}/estudiante/${id}`);
export const crearConsulta = (data) => post(base, data);
export const actualizarConsulta = (id, data) => put(`${base}/${id}`, data);
export const eliminarConsulta = (id) => del(`${base}/${id}`);
export const totalConsultas = () => get(`${base}/total`);
