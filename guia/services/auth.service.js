import { post, get, patch } from "./api";

// ── Login por slug de institución ────────────────────────────────────────────

export async function obtenerInfoInstitucion(slug) {
  const { data } = await get(`/auth/institucion/${slug}`);
  return data; // { id, nombre, logo, slug, esSuperAdmin }
}

export async function validarCorreoPorSlug(slug, correo) {
  const { data } = await post(`/auth/institucion/${slug}/validar-correo`, { correo });
  return data; // { token }
}

export async function validarPasswordPorSlug(slug, sessionToken, password) {
  const { data } = await post(`/auth/institucion/${slug}/validar-password`, { sessionToken, password });
  return data; // { token (jwt) }
}

export async function forzarSesionPorSlug(slug, sessionToken, password) {
  const { data } = await post(`/auth/institucion/${slug}/forzar-sesion`, { sessionToken, password });
  return data;
}

// ── Login super admin ─────────────────────────────────────────────────────────

export async function validarCorreoSuperAdmin(correo) {
  const { data } = await post("/auth/super-admin/validar-correo", { correo });
  return data;
}

export async function validarPasswordSuperAdmin(sessionToken, password) {
  const { data } = await post("/auth/super-admin/validar-password", { sessionToken, password });
  return data;
}

// ── Perfil y sesión ───────────────────────────────────────────────────────────

export async function obtenerPerfil() {
  const { data } = await get("/auth/mi-perfil");
  return data;
}

export async function cerrarSesionBackend() {
  try { await post("/auth/logout", {}); } catch { /* best-effort */ }
}

export async function obtenerPerfilDetalle() {
  const { data } = await get("/perfil");
  return data;
}

export async function actualizarMiPerfil(data) {
  const { data: resp } = await patch("/perfil", data);
  return resp;
}

// ── Compatibilidad (endpoints antiguos) ──────────────────────────────────────

export async function validarCorreo(correo) {
  const { data } = await post("/auth/validar-correo", { correo });
  return data;
}

export async function validarPassword(sessionToken, password) {
  const { data } = await post("/auth/validar-password", { sessionToken, password });
  return data;
}