import { get, post, put, del } from "../api/api";

const base = "/estudiantes";

export const obtenerTodosEstudiantes = () => get(base);
export const obtenerEstudiantePorId = (id) => get(`${base}/${id}`);
export const buscarEstudiante = (valor) => get(`${base}/buscar?valor=${valor}`);
export const crearEstudiante = (data) => post(base, data);
export const actualizarEstudiante = (id, data) => put(`${base}/${id}`, data);
export const eliminarEstudiante = (id) => del(`${base}/${id}`);
export const totalEstudiantes = () => get(`${base}/total`);


import axios from "axios";
export const obtenerImagenEstudiante = (id) =>
  axios.get(`http://localhost:8085/api/estudiantes/${id}/imagen`, {
    responseType: "blob",
  });

export const subirImagenEstudiante = (id, archivo) => {
  const formData = new FormData();
  formData.append("archivo", archivo);
  return post(`${base}/${id}/imagen`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const eliminarImagenEstudiante = (id) => del(`${base}/${id}/imagen`);
