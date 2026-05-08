//dashboard.service.js

import { get } from "./api";

const BASE = "/estadisticas";

export const getDashboardKpis          = (anioId) => get(`${BASE}/dashboard?anioId=${anioId}`).then(r => r.data);
export const getDashboardCategorias    = (anioId) => get(`${BASE}/dashboard/categorias?anioId=${anioId}`).then(r => r.data);
export const getDashboardTop1PorGrado  = (anioId) => get(`${BASE}/dashboard/top1-por-grado?anioId=${anioId}`).then(r => r.data);
export const getDashboardTopEstudiantes = (anioId) => get(`${BASE}/dashboard/top-estudiantes?anioId=${anioId}`).then(r => r.data);
export const getDashboardPromediosGrados = (anioId) => get(`${BASE}/dashboard/promedios-grados?anioId=${anioId}`).then(r => r.data);
export const getDashboardMejorGrupoPorGrado = (anioId) => get(`${BASE}/dashboard/mejor-grupo-por-grado?anioId=${anioId}`).then(r => r.data);

export const getPoblacion = (anioId, gradoId, grupoId) => get(buildUrl(`${BASE}/poblacion`, anioId, gradoId, grupoId)).then(r => r.data);
export const getRendimiento = (anioId, gradoId, grupoId) => get(buildUrl(`${BASE}/rendimiento`, anioId, gradoId, grupoId)).then(r => r.data);
export const getTopEstudiantes = (anioId, gradoId, grupoId) => get(buildUrl(`${BASE}/top-estudiantes`, anioId, gradoId, grupoId)).then(r => r.data);
export const getMateriasRanking = (anioId, gradoId, grupoId) => get(buildUrl(`${BASE}/materias-ranking`, anioId, gradoId, grupoId)).then(r => r.data);
export const getCategorias = (anioId, gradoId, grupoId) => get(buildUrl(`${BASE}/categorias`, anioId, gradoId, grupoId)).then(r => r.data);
export const getDistribucionPromedios = (anioId, gradoId, grupoId) => get(buildUrl(`${BASE}/distribucion-promedios`, anioId, gradoId, grupoId)).then(r => r.data);

function buildUrl(base, anioId, gradoId, grupoId) {
    const params = new URLSearchParams({ anioId });
    if (gradoId) params.set("gradoId", gradoId);
    if (grupoId) params.set("grupoId", grupoId);
    return `${base}?${params.toString()}`;
}