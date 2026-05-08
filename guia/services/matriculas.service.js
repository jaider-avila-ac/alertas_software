import { get, post, del, patch } from "./api";

const BASE = "/matriculas";

export const obtenerEstudiantesSinMatricula = () => get(`${BASE}/estudiantes-sin-matricula`).then(r => r.data);
export const obtenerAnioActivo              = ()          => get("/anios/activo").then(r => r.data);
export const obtenerGrados                  = ()          => get("/grados").then(r => r.data);
export const obtenerGruposPorGrado          = (gradoId)   => get(`/grupos/por-grado/${gradoId}`).then(r => r.data);
export const obtenerMatriculados            = ()          => get(BASE).then(r => r.data);
export const matricularEstudiante           = (payload)   => post(BASE, payload).then(r => r.data);
export const eliminarMatricula              = (id)        => del(`${BASE}/${id}`).then(r => r.data);
export const retirarMatricula               = (id)        => patch(`${BASE}/${id}/retirar`).then(r => r.data);