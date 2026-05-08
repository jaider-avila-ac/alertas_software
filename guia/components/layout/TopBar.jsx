import { LogOut, Moon, Sun, Menu } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const ROUTE_TITLES = {
  "dashboard": "Dashboard",
  "docentes": "Docentes",
  "docentes/nuevo": "Nuevo docente",
  "estudiantes": "Estudiantes",
  "estudiantes/nuevo": "Nuevo estudiante",
  "grados": "Grados",
  "grados/nuevo": "Nuevo grado",
  "materias": "Materias",
  "anio-academico": "Año académico",
  "matriculas": "Matrículas",
  "asignaciones": "Asignaciones",
  "mis-asignaciones": "Mis asignaciones",
  "mis-notas": "Mis notas",
  "grupos": "Grupos",
  "super-admin/instituciones": "Instituciones",
};

function getTitle(pathname, slug) {
  const pathWithoutSlug = slug && pathname.startsWith(`/${slug}/`)
    ? pathname.replace(`/${slug}/`, "")
    : pathname;
  const cleanPath = pathWithoutSlug.startsWith("/") ? pathWithoutSlug.slice(1) : pathWithoutSlug;

  if (cleanPath.match(/docentes\/editar\/\d+/)) return "Editar docente";
  if (cleanPath.match(/estudiantes\/editar\/\d+/)) return "Editar estudiante";
  if (cleanPath.match(/estudiantes\/notas\/\d+/)) return "Notas del estudiante";
  if (cleanPath.match(/grados\/\d+\/grupos\/\d+\/estudiantes/)) return "Estudiantes del grupo";
  if (cleanPath.match(/grados\/\d+\/grupos$/)) return "Grupos";

  return ROUTE_TITLES[cleanPath] ?? "SIAT";
}

export default function TopBar({ onMenuToggle }) {
  const { perfil, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const { pathname } = useLocation();
  const { slug } = useParams();

  const nombre = perfil
    ? `${perfil.nombres ?? ""} ${perfil.apellidos ?? ""}`.trim()
    : "";

  return (
    <header className="h-14 md:h-16 shrink-0 sticky top-0 z-10 flex items-center px-3 md:px-6 bg-white border-b border-gray-100 gap-2">

      <button
        onClick={onMenuToggle}
        className="md:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      <span className="text-base md:text-lg font-bold text-gray-800 truncate">
        {getTitle(pathname, slug)}
      </span>

      <div className="ml-auto flex items-center gap-2 md:gap-3">

        {/* Toggle dark/light */}
        <button
          onClick={toggle}
          title={dark ? "Modo claro" : "Modo oscuro"}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-sm shrink-0">
            {nombre ? nombre[0].toUpperCase() : "U"}
          </div>
          {nombre && (
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-semibold text-gray-800">{nombre}</div>
              <div className="text-xs text-gray-400">{perfil?.rol}</div>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>

    </header>
  );
}
