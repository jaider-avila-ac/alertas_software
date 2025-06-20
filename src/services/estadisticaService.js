import { get } from "../api/api";

const base = "/estadisticas";

export const obtenerEstadisticas = () => get(base);