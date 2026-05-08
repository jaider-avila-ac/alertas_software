import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, LogOut, Users, AlertTriangle, BarChart4, User,
  FileText, UserCog, CalendarDays, UserPlus, PanelLeftClose, PanelLeft,
} from "lucide-react";
import logo from "../../assets/alertas-logo.png";
import { UserContext } from "../../context/UserContext";

const NAV_BY_ROL = {
  0: [
    { to: "/",             Icon: Home,          label: "Inicio",           end: true },
    { to: "/estudiantes",  Icon: Users,         label: "Estudiantes"                },
    { to: "/consultas",    Icon: AlertTriangle, label: "Alertas"                    },
    { to: "/estadisticas", Icon: BarChart4,     label: "Estadísticas"               },
    { to: "/perfil",       Icon: User,          label: "Mi perfil"                  },
  ],
  1: [
    { to: "/",            Icon: Home,          label: "Inicio",     end: true },
    { to: "/mis-alertas", Icon: AlertTriangle, label: "Alertas"               },
    { to: "/citas",       Icon: CalendarDays,  label: "Citas"                 },
    { to: "/perfil",      Icon: User,          label: "Mi perfil"             },
  ],
  2: [
    { to: "/",             Icon: Home,          label: "Inicio",         end: true },
    { to: "/citas",        Icon: CalendarDays,  label: "Citas"                     },
    { to: "/consultas",    Icon: AlertTriangle, label: "Alertas"                   },
    { to: "/seguimientos", Icon: FileText,      label: "Seguimientos"              },
    { to: "/estadisticas", Icon: BarChart4,     label: "Estadísticas"              },
    { to: "/perfil",       Icon: User,          label: "Mi perfil"                 },
  ],
  3: [
    { to: "/",             Icon: Home,          label: "Inicio",             end: true },
    { to: "/estudiantes",  Icon: Users,         label: "Estudiantes"                   },
    { to: "/docentes",     Icon: UserPlus,      label: "Docentes"                      },
    { to: "/psicos",       Icon: UserCog,       label: "Psicorientadores"              },
    { to: "/consultas",    Icon: AlertTriangle, label: "Alertas"                       },
    { to: "/citas",        Icon: CalendarDays,  label: "Citas"                         },
    { to: "/seguimientos", Icon: FileText,      label: "Seguimientos"                  },
    { to: "/estadisticas", Icon: BarChart4,     label: "Estadísticas"                  },
    { to: "/perfil",       Icon: User,          label: "Mi perfil"                     },
  ],
};

export default function Sidebar({ open, onToggle, onClose }) {
  const { usuario, setUsuario } = useContext(UserContext);
  const navigate = useNavigate();

  const items = NAV_BY_ROL[usuario.rol] ?? [];

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario({ id: null, idUsuario: null, nombre: "", rol: null });
    navigate("/login", { replace: true });
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) onClose();
  };

  return (
    <>
      {/* Cabecera del sidebar: logo + botón colapsar */}
      <div className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-pink-400">
        {open && (
          <img src={logo} alt="Logo Alertas" className="h-8 w-auto" />
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-md text-white/70 hover:text-white hover:bg-pink-600 transition-colors hidden md:flex"
          title={open ? "Colapsar menú" : "Expandir menú"}
        >
          {open ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
        </button>
      </div>

      {/* Links de navegación */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {items.map(({ to, Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 whitespace-nowrap
               ${isActive
                 ? "bg-white text-pink-500 font-semibold"
                 : "text-white hover:bg-pink-600"
               }`
            }
          >
            <Icon size={17} className="shrink-0" />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Botón cerrar sesión */}
      <div className="border-t border-pink-400 px-2 py-3">
        <button
          onClick={cerrarSesion}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white hover:bg-pink-600 transition-colors w-full whitespace-nowrap"
        >
          <LogOut size={17} className="shrink-0" />
          {open && <span>Cerrar sesión</span>}
        </button>
      </div>
    </>
  );
}
