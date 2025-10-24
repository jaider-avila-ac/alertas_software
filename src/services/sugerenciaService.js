import { get, post } from "../api/api";

const base = "/sugerencias";

export const obtenerTodasSugerencias = async () => {
  const res = await get(base);
  return res.data;
};
export const crearSugerencia = (data) => post(base, data);
