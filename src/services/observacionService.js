import { get, post, put, del } from "../api/api";

const base = "/observaciones";


export const obtenerObservacionesPorSeguimiento = (seguimientoId) =>
  get(`${base}/seguimiento/${seguimientoId}`);


export const crearObservacion = (data) =>
  post(base, data); 


export const actualizarObservacion = (id, data) =>
  put(`${base}/${id}`, data);


export const eliminarObservacion = (id) =>
  del(`${base}/${id}`);
