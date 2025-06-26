import { obtenerTodasConsultas } from "../services/consultaService";

export const procesarConsultas = async () => {
  try {
    const res = await obtenerTodasConsultas();

    const consultas = res.data;

    console.log("📦 Datos crudos recibidos:", res);
    console.log("📄 Lista de consultas:", consultas);

    return consultas.map((c) => ({
      id: c.id,
      estudianteId: c.estudianteId, 
      nombreEstudiante: c.nombreEstudiante || "Sin nombre",
      motivo: c.motivo || "Sin motivo",
      estado: (c.estado || "pendiente").toLowerCase(),
      fecha: c.fecha,
      nivel: c.nivel?.toLowerCase() ?? "leve",
    }));
  } catch (error) {
    console.error("Error procesando consultas:", error);
    return [];
  }
};
