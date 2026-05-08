import { get, post, put } from "./api";

const BASE = "/grupos";

export const listarGruposPorGrado     = (gradoId)       => get(`${BASE}/por-grado/${gradoId}`).then(r => r.data);
export const crearGrupo               = (gradoId, data) => post(`${BASE}/grado/${gradoId}`, data).then(r => r.data);
export const actualizarGrupo          = (id, data)      => put(`${BASE}/${id}`, data).then(r => r.data);
export const listarEstudiantesDeGrupo = (grupoId, anioId) => get(`/estudiantes/grupo/${grupoId}/${anioId}`).then(r => r.data);