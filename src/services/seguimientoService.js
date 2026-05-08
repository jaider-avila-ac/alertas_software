import { get, post, put } from "../api/api";

const base = "/seguimientos";

export const obtenerSeguimientoPorId = (id) => get(`${base}/${id}`);

export const obtenerSeguimientosCitaPorCita = (citaId) =>
  get(`/seguimientos-citas/cita/${citaId}`);

// Obtener seguimiento por consulta
export const obtenerSeguimientosPorConsulta = (consultaId) =>
  get(`${base}/consulta/${consultaId}`);

// Crear seguimiento
export const crearSeguimiento = (data) => post(base, data);

// Contar seguimientos por consulta (si tienes este endpoint implementado)
export const contarSeguimientosPorConsulta = (consultaId) =>
  get(`${base}/cantidad/${consultaId}`);

// Obtener estudiantes con seguimientos
export const obtenerEstudiantesConSeguimientos = () =>
  get(`${base}/estudiantes-con-seguimientos`);

// Generar resumen general automáticamente con IA
export const generarResumenIA = (seguimientoId) =>
  put(`${base}/${seguimientoId}/generar-resumen`);

// Guardar o actualizar el resumen general manualmente
export const guardarResumenGeneral = (seguimientoId, resumen) =>
  put(`${base}/${seguimientoId}/resumen-manual`, { resumen });


