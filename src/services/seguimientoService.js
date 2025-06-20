import { get, post } from "../api/api";

const base = "/seguimientos";

export const obtenerSeguimientosPorConsulta = (consultaId) =>
  get(`${base}/consulta/${consultaId}`);

export const crearSeguimiento = (data) => post(base, data);

export const obtenerEstadoActual = (consultaId) =>
  get(`${base}/estado/${consultaId}`);
