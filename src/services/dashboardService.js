import { get } from "../api/api";

const base = "/dashboard";

export const obtenerResumenDashboard = (rol, id) =>
  get(`${base}/resumen/${rol}/${id}`);