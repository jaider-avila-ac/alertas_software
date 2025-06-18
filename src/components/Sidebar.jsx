import { Home, LogOut, Users, AlertTriangle, ClipboardList, User, FileText } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import logo from "../assets/alertas-logo.png";

export const Sidebar = () => {
  const items = [
    {
      icon: Home,
      label: "Inicio",
      active: true, // esta opción está seleccionada
    },
    { icon: Users, label: "Estudiantes" },
    { icon: AlertTriangle, label: "Alertas" },
    { icon: ClipboardList, label: "Seguimientos" },
    { icon: User, label: "Perfil" },
    { icon: FileText, label: "Reportes" },
    { icon: LogOut, label: "Cerrar sesión" },
  ];

  return (
    <aside className="w-64 bg-pink-500 text-white flex flex-col">
      {/* Logo en la parte superior */}
      <div className="h-16 flex items-center justify-center mb-4">
        <img src={logo} alt="Logo Alertas" className="h-10" />
      </div>

      {/* Lista de ítems */}
      <div className="flex flex-col space-y-4">
        {items.map((item, i) => (
          <SidebarItem key={i} {...item} />
        ))}
      </div>
    </aside>
  );
};
