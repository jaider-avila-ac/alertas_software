import { get, post, put } from "./api";

const BASE = "/anios";  // ← Cambiar de "/anio-academico" a "/anios"

export const listarAnios        = ()              => get(BASE).then(r => r.data);
export const crearAnio          = (anio)          => post(`${BASE}?anio=${encodeURIComponent(anio)}`, {}).then(r => r.data);
export const activarAnio        = (id)            => put(`${BASE}/${id}/activar`, {}).then(r => r.data);
export const cerrarAnio         = (id)            => put(`${BASE}/${id}/cerrar`, {}).then(r => r.data);
export const obtenerAnioActivo  = ()              => get(`${BASE}/activo`).then(r => r.data);  // ← Esta línea corregida
export const obtenerConfigEval  = (anioId)        => get(`${BASE}/${anioId}/config`).then(r => r.data);
export const guardarConfigEval  = (anioId, data)  => put(`${BASE}/${anioId}/config`, data).then(r => r.data);
export const listarNotas        = (anioId)        => get(`${BASE}/${anioId}/notas-config`).then(r => r.data);
export const reemplazarNotas    = (anioId, notas) => put(`${BASE}/${anioId}/notas-config`, notas).then(r => r.data);