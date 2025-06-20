import { obtenerTodasConsultas } from "../services/consultaService";


export const procesarConsultas = async (docenteId = null) => {
  try {
    const res = await obtenerTodasConsultas();

    const filtradas = res.data.filter((c) => !docenteId || c.docenteId === docenteId);

    return filtradas.map((c) => ({
      id: c.id,
      estudianteId: c.estudianteId,
      nombre: `${c.estudianteNombres} ${c.estudianteApellidos}`,
      documento: c.estudianteDocumento,
      docenteId: c.docenteId,
      motivo: c.motivo,
      descargos: c.descargos,
      alerta: c.alerta,
      estado: (c.estado || "pendiente").toLowerCase(),
      fecha: c.fecha,
      metodoValidacion: c.metodoValidacion,
      presenciaEstudiante: c.presenciaEstudiante,
    }));
  } catch (error) {
    console.error("Error procesando consultas:", error);
    return [];
  }
};
