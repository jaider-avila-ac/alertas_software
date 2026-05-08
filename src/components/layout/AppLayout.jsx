import { useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { ToDoFlotante } from "../ToDoFlotante";
import { useInactivityTimer } from "../../hooks/useInactivityTimer";
import { UserContext } from "../../context/UserContext";

export default function AppLayout() {
  const [open, setOpen] = useState(() => window.innerWidth >= 768);
  const navigate = useNavigate();
  const { setUsuario } = useContext(UserContext);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("usuario");
    setUsuario({ id: null, idUsuario: null, nombre: "", rol: null });
    navigate("/login", { replace: true });
  }, [navigate, setUsuario]);

  useInactivityTimer(handleLogout);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Sidebar: fixed en móvil, sticky en escritorio */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col bg-pink-500
          transition-all duration-300 ease-in-out
          md:sticky md:top-0 md:h-screen md:z-auto md:shrink-0
          ${open
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full md:translate-x-0 md:w-16"
          }
        `}
      >
        <Sidebar
          open={open}
          onToggle={() => setOpen((v) => !v)}
          onClose={() => setOpen(false)}
        />
      </aside>

      {/* Overlay oscuro en móvil cuando el sidebar está abierto */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Área principal */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <TopBar onMenuToggle={() => setOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
          <ToDoFlotante />
        </main>
      </div>

    </div>
  );
}
