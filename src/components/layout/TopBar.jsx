import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { UserContext } from "../../context/UserContext";

const NOMBRES_ROL = {
  0: "Docente",
  1: "Estudiante",
  2: "Psicorientador",
  3: "Administrador",
};

const ROUTE_TITLES = {
  "/":                       "Panel",
  "/estudiantes":            "Estudiantes",
  "/consultas":              "Alertas por Estudiante",
  "/consultas/nueva":        "Nueva Alerta",
  "/estadisticas":           "Estadísticas",
  "/citas":                  "Citas",
  "/alertas":                "Gestión de Alertas",
  "/mis-alertas":            "Mis Alertas",
  "/perfil":                 "Mi Perfil",
  "/seguimientos":           "Seguimientos",
  "/docentes":               "Docentes",
  "/psicos":                 "Psicorientadores",
  "/formulario-estudiante":  "Nuevo Estudiante",
  "/formulario-docente":     "Nuevo Docente",
  "/formulario-psico":       "Nuevo Psicorientador",
};

function getTitle(pathname) {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];

  if (/^\/consultas\/estudiante\/\d+/.test(pathname))     return "Alertas";
  if (/^\/consultas\/nueva\/\d+/.test(pathname))          return "Nueva Alerta";
  if (/^\/editar-alerta\/\d+/.test(pathname))             return "Editar Alerta";
  if (/^\/estudiantes\/\d+/.test(pathname))               return "Detalle Estudiante";
  if (/^\/seguimientos\/\d+/.test(pathname))              return "Seguimientos";
  if (/^\/citas\/activa\/\d+/.test(pathname))             return "Cita Activa";
  if (/^\/formulario-estudiante\/\d+/.test(pathname))     return "Editar Estudiante";
  if (/^\/formulario-docente\/\d+/.test(pathname))        return "Editar Docente";
  if (/^\/formulario-psico\/\d+/.test(pathname))          return "Editar Psicorientador";

  return "Sistema de Alertas";
}

export default function TopBar({ onMenuToggle }) {
  const { usuario, setUsuario } = useContext(UserContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const inicial = usuario?.nombre?.[0]?.toUpperCase() || "U";

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario({ id: null, idUsuario: null, nombre: "", rol: null });
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-14 md:h-16 shrink-0 sticky top-0 z-10 flex items-center px-3 md:px-6 bg-white border-b border-gray-100 gap-2">

      {/* Hamburger — solo móvil */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Título de la página actual */}
      <span className="text-base md:text-lg font-bold text-gray-800 truncate">
        {getTitle(pathname)}
      </span>

      <div className="ml-auto flex items-center gap-2 md:gap-3">

        {/* Avatar + nombre */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm shrink-0">
            {inicial}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-gray-800 m-0">{usuario?.nombre}</p>
            <p className="text-xs text-gray-400 m-0">{NOMBRES_ROL[usuario?.rol] ?? "—"}</p>
          </div>
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={cerrarSesion}
          title="Cerrar sesión"
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Salir</span>
        </button>

      </div>
    </header>
  );
}
