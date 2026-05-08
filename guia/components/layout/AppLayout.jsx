import { useState, useCallback } from "react";
import { Outlet, Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useInactivity } from "../../hooks/useInactivity";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ForzadoLogoutModal from "../ForzadoLogoutModal";

const ROLES_SIN_ANIO = ["SUPER_ADMIN"];

export default function AppLayout() {
  const { token, logout, perfil, loadingPerfil, anioActivo, loadingAnio, forzadoInfo, clearForzado } = useAuth();
  const { slug } = useParams();
  const [open, setOpen] = useState(() => window.innerWidth >= 768);
  const location = useLocation();

  useInactivity(useCallback(() => logout(), [logout]));

  if (!token) {
    return <Navigate to={`/${slug}`} replace />;
  }

  // Esperar a que se cargue el perfil antes de evaluar el año
  if (loadingPerfil || loadingAnio) {
    return null;
  }

  // Roles que requieren año activo para operar
  const rol = (perfil?.rol ?? "").toUpperCase();
  const requiereAnio = !!perfil && !ROLES_SIN_ANIO.includes(rol);

  if (requiereAnio && anioActivo === null && !location.pathname.endsWith("/anio-academico")) {
    return <Navigate to={`/${slug}/anio-academico`} replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar open={open} onToggle={() => setOpen(v => !v)} onClose={() => setOpen(false)} />

      {open && (
        <div className="sidebar-overlay md:hidden" onClick={() => setOpen(false)} />
      )}

      <div className={`app-main ${open ? "" : "app-main--sm"}`}>
        <TopBar onMenuToggle={() => setOpen(v => !v)} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <ForzadoLogoutModal info={forzadoInfo} onConfirm={clearForzado} />
    </div>
  );
}
