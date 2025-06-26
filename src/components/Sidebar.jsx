import { useContext } from "react";
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
  Search
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import logo from "../assets/alertas-logo.png";
import { UserContext } from "../context/UserContext";

export const Sidebar = () => {
  const location = useLocation();
  const { usuario } = useContext(UserContext);

  const itemsDocente = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: Users, label: "Estudiantes", path: "/estudiantes" },
    { icon: AlertTriangle, label: "Alertas", path: "/consultas" },
    { icon: BarChart4, label: "Estadísticas", path: "/estadisticas" },
  ];

  const itemsPsico = [
  { icon: Home, label: "Inicio", path: "/psicorientador" },
  { icon: Users, label: "Estudiantes", path: "/psicorientador/estudiantes" },
  { icon: CalendarDays, label: "Citas", path: "/psicorientador/citas" },
  { icon: FileText, label: "Seguimientos", path: "/psicorientador/seguimientos" },
  { icon: BarChart4, label: "Estadísticas", path: "/psicorientador/estadisticas" },
];


  const comunes = [
    { icon: User, label: "Perfil", path: "/perfil" },
    { icon: LogOut, label: "Cerrar sesión", path: "/logout" },
  ];

  const items = usuario.rol === 2
    ? [...itemsPsico, ...comunes]
    : [...itemsDocente, ...comunes];

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-pink-500 text-white flex flex-col z-30">
      <div className="h-16 flex items-center justify-center mb-4">
        <img src={logo} alt="Logo Alertas" className="h-10" />
      </div>
      <div className="flex-1 overflow-y-auto px-2 space-y-4">
        {items.map((item, i) => (
          <SidebarItem
            key={i}
            {...item}
            active={
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path + "/"))
            }
          />
        ))}
      </div>
    </aside>
  );
};
