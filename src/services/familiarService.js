import { get, post, put, del } from "../api/api";

const base = "/familiares";

export const obtenerFamiliaresPorEstudiante = (estudianteId) =>
  get(`${base}/estudiante/${estudianteId}`);

export const crearFamiliar = (data) => post(base, data);

export const actualizarFamiliar = (id, data) => put(`${base}/${id}`, data);

export const eliminarFamiliar = (id) => del(`${base}/${id}`);
