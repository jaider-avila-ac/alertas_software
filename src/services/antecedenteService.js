import { get, post, put } from "../api/api";

const base = "/antecedentes";

export const obtenerAntecedentesPorEstudiante = (id) => get(`${base}/estudiante/${id}`);

export const crearAntecedentes = (data) => post(base, data);

export const actualizarAntecedentes = (id, data) => put(`${base}/${id}`, data);
