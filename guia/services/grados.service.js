import { get, post, put } from "./api";

const BASE = "/grados";

export const listarGrados    = ()         => get(BASE).then(r => r.data);
export const crearGrado      = (data)     => post(BASE, data).then(r => r.data);
export const actualizarGrado = (id, data) => put(`${BASE}/${id}`, data).then(r => r.data);