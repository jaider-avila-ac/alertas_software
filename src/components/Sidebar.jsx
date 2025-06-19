import { useLocation } from "react-router-dom";
import { Home, LogOut, Users, AlertTriangle, ClipboardList, User, FileText } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import logo from "../assets/alertas-logo.png";

export const Sidebar = () => {
  const location = useLocation(); // Ruta actual

  const items = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: Users, label: "Estudiantes", path: "/estudiantes" },
    { icon: AlertTriangle, label: "Alertas", path: "/alertas" },
    { icon: ClipboardList, label: "Seguimientos", path: "/seguimientos" },
    { icon: User, label: "Perfil", path: "/perfil" },
    { icon: FileText, label: "Reportes", path: "/reportes" },
    { icon: LogOut, label: "Cerrar sesión", path: "/logout" },
  ];

  return (
    <aside className="w-64 bg-pink-500 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center mb-4">
        <img src={logo} alt="Logo Alertas" className="h-10" />
      </div>

      <div className="flex flex-col space-y-4">
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
