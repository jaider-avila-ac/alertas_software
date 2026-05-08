import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SLUG_KEY } from "../../config/config";
import {
  LayoutDashboard, UserCheck, Users, Layers, BookOpen,
  Calendar, ClipboardList, Network, BookMarked,
  ClipboardCheck, PanelLeftClose, PanelLeft, Building2, UserCircle,
} from "lucide-react";

const NAV_BY_ROL = {
  SUPER_ADMIN: [
    { to: "super-admin/instituciones", Icon: Building2,    label: "Instituciones" },
    { to: "mi-perfil",                 Icon: UserCircle,   label: "Mi perfil"     },
  ],
  ADMIN_INSTITUCION: [
    { to: "dashboard",      Icon: LayoutDashboard, label: "Dashboard"      },
    { to: "docentes",       Icon: UserCheck,       label: "Docentes"       },
    { to: "estudiantes",    Icon: Users,           label: "Estudiantes"    },
    { to: "grados",         Icon: Layers,          label: "Grados"         },
    { to: "materias",       Icon: BookOpen,        label: "Materias"       },
    { to: "anio-academico", Icon: Calendar,        label: "Año académico"  },
    { to: "matriculas",     Icon: ClipboardList,   label: "Matrículas"     },
    { to: "asignaciones",   Icon: Network,         label: "Asignaciones"   },
    { to: "mi-perfil",      Icon: UserCircle,      label: "Mi perfil"      },
  ],
  SECRETARIO: [
    { to: "dashboard",      Icon: LayoutDashboard, label: "Dashboard"      },
    { to: "estudiantes",    Icon: Users,           label: "Estudiantes"    },
    { to: "grados",         Icon: Layers,          label: "Grados"         },
    { to: "matriculas",     Icon: ClipboardList,   label: "Matrículas"     },
    { to: "mi-perfil",      Icon: UserCircle,      label: "Mi perfil"      },
  ],
  DOCENTE: [
    { to: "mis-asignaciones", Icon: BookMarked,  label: "Mis asignaciones" },
    { to: "mi-perfil",        Icon: UserCircle,  label: "Mi perfil"        },
  ],
  ESTUDIANTE: [
    { to: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
    { to: "mi-grupo",  Icon: Users,           label: "Mi grupo"  },
    { to: "mis-notas", Icon: ClipboardCheck,  label: "Mis notas" },
    { to: "mi-perfil", Icon: UserCircle,      label: "Mi perfil" },
  ],
  // Backward compat
  ADMIN: [
    { to: "dashboard",      Icon: LayoutDashboard, label: "Dashboard"      },
    { to: "docentes",       Icon: UserCheck,       label: "Docentes"       },
    { to: "estudiantes",    Icon: Users,           label: "Estudiantes"    },
    { to: "grados",         Icon: Layers,          label: "Grados"         },
    { to: "materias",       Icon: BookOpen,        label: "Materias"       },
    { to: "anio-academico", Icon: Calendar,        label: "Año académico"  },
    { to: "matriculas",     Icon: ClipboardList,   label: "Matrículas"     },
    { to: "asignaciones",   Icon: Network,         label: "Asignaciones"   },
  ],
};

export default function Sidebar({ open, onToggle, onClose }) {
  const { perfil } = useAuth();
  const slug = localStorage.getItem(SLUG_KEY);
  const rol = (perfil?.rol ?? "ADMIN").toUpperCase();
  const items = NAV_BY_ROL[rol] ?? NAV_BY_ROL.ADMIN;

  const handleNavClick = () => {
    if (window.innerWidth < 768) onClose();
  };

  // Construir la ruta completa con slug
  const getRoute = (path) => {
    if (rol === "SUPER_ADMIN") {
      return `/${slug}/${path}`;
    }
    return `/${slug}/${path}`;
  };

  return (
    <aside className={`sidebar bg-white border-r border-gray-200 flex flex-col ${open ? "" : "sidebar--sm"}`}>

      <div className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-gray-100">
        {open && (
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {open ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {items.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={getRoute(to)}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap mb-0.5
               ${isActive
                 ? "bg-cyan-50 text-cyan-500 font-semibold"
                 : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`
            }
          >
            <Icon size={17} className="shrink-0" />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}