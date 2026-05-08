import { get, patch } from "./api";

export async function listarInstituciones() {
  const { data } = await get("/super-admin/instituciones");
  return data;
}

export async function activarInstitucion(token) {
  const { data } = await patch(`/super-admin/instituciones/activar/${token}`);
  return data;
}

export async function habilitarInstitucion(id) {
  const { data } = await patch(`/super-admin/instituciones/${id}/habilitar`);
  return data;
}

export async function deshabilitarInstitucion(id) {
  const { data } = await patch(`/super-admin/instituciones/${id}/deshabilitar`);
  return data;
}
