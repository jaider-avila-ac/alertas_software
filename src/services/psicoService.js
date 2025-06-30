import { get, post, put, del } from "../api/api";

const base = "/psicorientadores";

export const obtenerTodosPsicos = () => get(base);

export const obtenerPsicoPorId = (id) => get(`${base}/${id}`);

export const buscarPsico = (params) => get(`${base}/buscar?${params}`);

export const crearPsico = (data) => post(base, data);

export const actualizarPsico = (id, data) => put(`${base}/${id}`, data);

export const eliminarPsico = (id) => del(`${base}/${id}`);

export const totalPsicos = () => get(`${base}/total`);
