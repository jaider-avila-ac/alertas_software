import { get, post, put, del } from "./api";

const BASE = "/materias";
const CAT_BASE = "/categorias-materias";

export const listarMaterias       = () => get(BASE).then(r => r.data);
export const crearMateria         = (data) => post(BASE, data).then(r => r.data);
export const actualizarMateria    = (id, data) => put(`${BASE}/${id}`, data).then(r => r.data);
export const eliminarMateria      = (id) => del(`${BASE}/${id}`).then(r => r.data);
export const quitarAsignaciones   = (id) => del(`${BASE}/${id}/asignaciones`).then(r => r.data);

export const listarGrados             = () => get("/grados").then(r => r.data);
export const obtenerMateriasDeGrado   = (gradoId) => get(`/grados/${gradoId}/materias`).then(r => r.data);
export const asignarMateriasAGrado    = (gradoId, ids) => post(`/grados/${gradoId}/materias`, { materiaIds: ids }).then(r => r.data);
export const desasignarMateriasDeGrado = (gradoId, ids) => del(`/grados/${gradoId}/materias`, { data: { materiaIds: ids } }).then(r => r.data);

export const listarCategorias = () => get(CAT_BASE).then(r => r.data);