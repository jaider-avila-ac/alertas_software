import { get, post } from "./api";

const BASE = "/calificaciones";

export const obtenerPlantillaAsignacion = (asignacionId, anioId) => 
  get(`${BASE}/docente/asignaciones/${asignacionId}/anio/${anioId}/plantilla`)
    .then(r => r.data);

// Guardado individual (un solo registro)
export const guardarCalificacionIndividual = (asignacionId, anioId, calificacion) => 
  post(`${BASE}/docente/asignaciones/${asignacionId}/anio/${anioId}/calificaciones`, [calificacion])
    .then(r => r.data);

// Guardado en lote (múltiples registros)
export const guardarCalificaciones = (asignacionId, anioId, calificaciones) => 
  post(`${BASE}/docente/asignaciones/${asignacionId}/anio/${anioId}/calificaciones`, calificaciones)
    .then(r => r.data);