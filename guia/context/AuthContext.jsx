import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { USER_KEY, SLUG_KEY } from "../config/config";
import { setApiToken, setUnauthorizedHandler } from "../services/api";
import { obtenerPerfil, cerrarSesionBackend } from "../services/auth.service";
import { obtenerAnioActivo } from "../services/anio-academico.service";
import { useSessionEvents } from "../hooks/useSessionEvents";

const AuthContext = createContext(null);

const ROLES_SIN_ANIO = ["SUPER_ADMIN"];

export function AuthProvider({ children }) {
  const [token, setToken]               = useState(() => localStorage.getItem(USER_KEY));
  const [perfil, setPerfil]             = useState(null);
  const [loadingPerfil, setLoading]     = useState(() => !!localStorage.getItem(USER_KEY));
  const [anioActivo, setAnioActivo]     = useState(null);
  const [loadingAnio, setLoadingAnio]   = useState(false);
  const [forzadoInfo, setForzadoInfo]   = useState(null);

  const logout = useCallback(async () => {
    const savedSlug = localStorage.getItem(SLUG_KEY) || "";
    await cerrarSesionBackend().catch(() => undefined);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SLUG_KEY);
    setToken(null);
    setPerfil(null);
    setAnioActivo(null);
    setApiToken(null);

    if (savedSlug) {
      window.location.href = `/${savedSlug}`;
    } else {
      window.location.href = "/";
    }
  }, []);

  const handleSesionForzada = useCallback((data) => {
    setForzadoInfo(data);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SLUG_KEY);
    setToken(null);
    setPerfil(null);
    setAnioActivo(null);
    setApiToken(null);
  }, []);

  const clearForzado = useCallback(() => {
    const savedSlug = localStorage.getItem(SLUG_KEY) || "";
    setForzadoInfo(null);
    if (savedSlug) {
      window.location.href = `/${savedSlug}`;
    } else {
      window.location.href = "/";
    }
  }, []);

  useSessionEvents(token, handleSesionForzada);

  const refreshAnioActivo = useCallback(async (rol) => {
    const rolActual = rol ?? perfil?.rol;
    if (!rolActual || ROLES_SIN_ANIO.includes(rolActual.toUpperCase())) {
      setAnioActivo(null);
      return;
    }
    setLoadingAnio(true);
    try {
      const a = await obtenerAnioActivo();
      setAnioActivo(a);
    } catch {
      setAnioActivo(null);
    } finally {
      setLoadingAnio(false);
    }
  }, [perfil?.rol]);

  useEffect(() => { setUnauthorizedHandler(logout); }, [logout]);
  useEffect(() => { setApiToken(token); }, [token]);

  useEffect(() => {
    if (!token) return;
    obtenerPerfil()
      .then(p => {
        setPerfil(p);
        if (!ROLES_SIN_ANIO.includes((p.rol ?? "").toUpperCase())) {
          setLoadingAnio(true);
          obtenerAnioActivo()
            .then(a => setAnioActivo(a))
            .catch(() => setAnioActivo(null))
            .finally(() => setLoadingAnio(false));
        }
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token, logout]);

  const login = useCallback((jwt, slug) => {
    localStorage.setItem(USER_KEY, jwt);
    if (slug) localStorage.setItem(SLUG_KEY, slug);
    setLoading(true);
    setToken(jwt);
  }, []);

  return (
    <AuthContext.Provider value={{
      token, perfil, loadingPerfil,
      anioActivo, loadingAnio, refreshAnioActivo,
      login, logout,
      forzadoInfo, clearForzado,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
