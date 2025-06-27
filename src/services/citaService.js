import { get, post, put } from "../api/api";

const base = "/citas";

export const obtenerCitas = () => get(base);

export const obtenerCitaPorId = (id) => get(`${base}/${id}`);

export const crearCita = (data) => post(base, data);

export const actualizarCita = (id, data) => put(`${base}/${id}`, data);

export const buscarCitas = (query) => get(`${base}/buscar${query}`);

export const totalCitas = () => get(`${base}/total`);

export const obtenerCitasPorEstudiante = (id) =>
  get(`${base}/buscar?estudiante=${id}`);

export const obtenerCitasPorPsico = (psicId) =>
  get(`/citas/buscar?psicorientador=${psicId}`);


export const agendarCitaParaConsulta = (consultaId, psicorientadorId, fecha) =>
  post(
    `${base}/agendar?consultaId=${consultaId}&psicorientadorId=${psicorientadorId}&fecha=${fecha}`
  );


export const cancelarCita = (id) => put(`${base}/cancelar/${id}`);

export const cambiarEstadoCita = (id, estado) =>
  put(`/citas/${id}/estado`, JSON.stringify(estado));