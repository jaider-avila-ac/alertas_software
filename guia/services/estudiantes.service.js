import { get, post, put, patch } from "./api";

const BASE = "/estudiantes";

export const listarEstudiantes = () => get(BASE).then(r => r.data);
export const crearEstudiante = (data) => post(BASE, data).then(r => r.data);
export const actualizarEstudiante = (id, data) => put(`${BASE}/${id}`, data).then(r => r.data);
export const generarUsuario = (nroDoc) =>
  post("/usuarios/generar", null, { params: { cedula: nroDoc, rol: 1 } }).then(r => r.data);
export const cambiarHabilitado = (id, habilitado) =>
    patch(`/estudiantes/${id}/habilitado`, { habilitado }).then(r => r.data);