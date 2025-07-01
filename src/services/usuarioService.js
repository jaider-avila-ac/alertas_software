import { get, post, put } from "../api/api";


export const obtenerUsuarioPorId = (id) => get(`/usuarios/${id}`);


export const cambiarContrasena = (datos) =>
  put("/usuarios/cambiar-contrasena", datos);


export const generarUsuarioEstudiante = (cedula) =>
  post(`/usuarios/generar?cedula=${cedula}&rol=1`);

export const generarUsuarioDocente = (cedula) =>
  post(`/usuarios/generar?cedula=${cedula}&rol=0`);

export const generarUsuarioPsicorientador = (cedula) =>
  post(`/usuarios/generar?cedula=${cedula}&rol=2`);

export const generarUsuariosEstudiantesMasivo = () =>
  post("/usuarios/generar-masivo?rol=1");

export const generarUsuariosDocentesMasivo = () =>
  post("/usuarios/generar-masivo?rol=0");

export const generarUsuariosPsicorientadoresMasivo = () =>
  post("/usuarios/generar-masivo?rol=2");

export const loginUsuario = (credenciales) =>
  post("/usuarios/login", credenciales);
