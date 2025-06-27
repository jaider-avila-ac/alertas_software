import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Home,
  LogOut,
  Users,
  AlertTriangle,
  BarChart4,
  User,
  FileText,
  CalendarDays,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import logo from "../assets/alertas-logo.png";
import { UserContext } from "../context/UserContext";

export const Sidebar = () => {
  const location = useLocation();
  const { usuario } = useContext(UserContext);

  const [ancho, setAncho] = useState(window.innerWidth);
  const esMovil = ancho < 640;
  const esTablet = ancho >= 640 && ancho < 1024;
  const esEscritorio = ancho >= 1024;

  useEffect(() => {
    const manejarResize = () => setAncho(window.innerWidth);
    window.addEventListener("resize", manejarResize);
    return () => window.removeEventListener("resize", manejarResize);
  }, []);

  const itemsDocente = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: Users, label: "Estudiantes", path: "/estudiantes" },
    { icon: AlertTriangle, label: "Alertas", path: "/consultas" },
    { icon: BarChart4, label: "Estadísticas", path: "/estadisticas" },
  ];

  const itemsPsico = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: CalendarDays, label: "Citas", path: "/citas" },
    { icon: AlertTriangle, label: "Alertas", path: "/consultas" },
    { icon: FileText, label: "Seguimientos", path: "/seguimientos" },
    { icon: BarChart4, label: "Estadísticas", path: "/estadisticas" },
  ];

  const comunes = [
    { icon: User, label: "Perfil", path: "/perfil" },
    { icon: LogOut, label: "Cerrar sesión", path: "/logout", ocultarEnMovil: true },
  ];

  const items = usuario.rol === 2
    ? [...itemsPsico, ...comunes]
    : [...itemsDocente, ...comunes];

  const tipoLayout = esEscritorio
    ? "vertical"
    : "horizontal"; // para móvil y tablet

  return (
    <aside
      className={`
        ${tipoLayout === "vertical"
          ? "fixed top-0 left-0 w-64 h-screen flex-col"
          : "fixed top-0 left-0 right-0 h-16 flex-row"}
        bg-pink-500 text-white flex z-50 justify-around items-center
        px-2
      `}
    >
      {tipoLayout === "vertical" && (
        <div className="h-16 flex items-center justify-center mb-4 w-full">
          <img src={logo} alt="Logo Alertas" className="h-10" />
        </div>
      )}

      <div
        className={`flex-1 ${tipoLayout === "horizontal" ? "flex gap-4 justify-center" : "space-y-4 w-full"}`}
      >
        {items.map((item, i) => {
          if ((esMovil || esTablet) && item.ocultarEnMovil) return null;

          return (
            <SidebarItem
              key={i}
              icon={item.icon}
              label={tipoLayout === "vertical" ? item.label : esTablet ? item.label : ""}
              path={item.path}
              active={
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path + "/"))
              }
              soloIcono={esMovil}
              textoHorizontal={esTablet}
            />
          );
        })}
      </div>
    </aside>
  );
};
