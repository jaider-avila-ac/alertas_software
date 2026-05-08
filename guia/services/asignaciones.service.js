import { get, post, del, patch } from "./api";

export const crearAsignacion       = (payload)  => post("/asignaciones", payload).then(r => r.data);
export const eliminarAsignacion    = (id)        => del(`/asignaciones/${id}`).then(r => r.data);
export const listarPorGrupo        = (grupoId)   => get(`/asignaciones/grupo/${grupoId}`).then(r => r.data);
export const listarGrados          = ()          => get("/grados").then(r => r.data);
export const listarGruposPorGrado  = (gradoId)   => get(`/grupos/por-grado/${gradoId}`).then(r => r.data);
export const listarDocentes        = ()          => get("/docentes").then(r => r.data);
export const obtenerMateriasDeGrado= (gradoId)   => get(`/grados/${gradoId}/materias`).then(r => r.data);
export const cambiarDocente = (id, docenteId) =>
  patch(`/asignaciones/${id}/docente`, { docenteId }).then(r => r.data);
export const quitarDocente = (id) =>
  del(`/asignaciones/${id}/docente`).then(r => r.data);
 