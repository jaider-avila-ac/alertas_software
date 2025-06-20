import { useLocation } from "react-router-dom";
import { Home, LogOut, Users, AlertTriangle, BarChart4, User, FileText } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import logo from "../assets/alertas-logo.png";

export const Sidebar = () => {
  const location = useLocation(); // Ruta actual

  const items = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: Users, label: "Estudiantes", path: "/estudiantes" },
    { icon: AlertTriangle, label: "Alertas", path: "/consultas" },
    { icon: BarChart4, label: "Estadisticas", path: "/estadisticas" },
    { icon: User, label: "Perfil", path: "/perfil" },
    { icon: FileText, label: "Reportes", path: "/reportes" },
    { icon: LogOut, label: "Cerrar sesión", path: "/logout" },
  ];

  return (
   <aside className="fixed left-0 top-0 w-64 h-screen bg-pink-500 text-white flex flex-col z-30">
  <div className="h-16 flex items-center justify-center mb-4 flex-shrink-0">
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
