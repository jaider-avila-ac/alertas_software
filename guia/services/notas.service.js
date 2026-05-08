import { get, post } from "./api";

const BASE = "/estudiantes";

export const getResumen = (estudianteId, anioId) =>
    get(`${BASE}/${estudianteId}/anio/${anioId}/resumen`).then(r => r.data);

export const getEstudiante = (estudianteId) =>
    get(`${BASE}/${estudianteId}`).then(r => r.data);

export const getMaterias = (estudianteId, anioId) =>
    get(`${BASE}/${estudianteId}/anio/${anioId}/materias`).then(r => r.data);

export const getNotasMateria = (estudianteId, materiaId, anioId) =>
    get(`${BASE}/${estudianteId}/materias/${materiaId}/anio/${anioId}/notas`).then(r => r.data);

export const getAnioActivo = () =>
    get("/anios/activo").then(r => r.data);

export const recalcularEstadisticas = (anioId) =>
    post(`/stored-procedures/actualizar-resultados/${anioId}`, {}).then(r => r.data);