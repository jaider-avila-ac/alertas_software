import { get, post, put, patch } from "./api";

const BASE = "/estudiantes";

export const listarEstudiantes = () => get(BASE).then(r => r.data);
export const crearEstudiante = (data) => post(BASE, data).then(r => r.data);
export const actualizarEstudiante = (id, data) => put(`${BASE}/${id}`, data).then(r => r.data);
export const generarUsuario = (personaId) => post("/usuarios/generar", { personaId }).then(r => r.data);
export const cambiarHabilitado = (id, habilitado) =>
    patch(`/estudiantes/${id}/habilitado`, { habilitado }).then(r => r.data);