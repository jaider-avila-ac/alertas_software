import { get, post, put } from "./api";

const BASE = "/docentes";

export const listarDocentes    = ()          => get(BASE).then(r => r.data);
export const crearDocente      = (data)      => post(BASE, data).then(r => r.data);
export const actualizarDocente = (id, data)  => put(`${BASE}/${id}`, data).then(r => r.data);
export const generarUsuario    = (personaId) => post("/usuarios/generar", { personaId }).then(r => r.data);