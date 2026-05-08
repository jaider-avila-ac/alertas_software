import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import KpiCard from "../../components/ui/KpiCard";
import DashboardStats from "./DashboardStats";
import { obtenerAnioActivo } from "../../services/anio-academico.service";
import { getDashboardKpis } from "../../services/dashboard.service";
import {
  UserCheck, Users, Layers, BookOpen,
  BookMarked, TrendingUp, ClipboardList,
} from "lucide-react";

const KPI_CONFIG = {
  ADMIN_INSTITUCION: [
    { key: "docentes",     title: "Docentes",     Icon: UserCheck,     color: "cyan",   to: "docentes"    },
    { key: "estudiantes",  title: "Estudiantes",  Icon: Users,         color: "green",  to: "estudiantes" },
    { key: "grados",       title: "Grados",       Icon: Layers,        color: "orange", to: "grados"      },
    { key: "materias",     title: "Materias",     Icon: BookOpen,      color: "red",    to: "materias"    },
  ],
  SECRETARIO: [
    { key: "estudiantes",  title: "Estudiantes",  Icon: Users,         color: "green",  to: "estudiantes" },
    { key: "grados",       title: "Grados",       Icon: Layers,        color: "orange", to: "grados"      },
    { key: "matriculas",   title: "Matrículas",   Icon: ClipboardList, color: "cyan",   to: "matriculas"  },
  ],
  DOCENTE: [
    { key: "misAsignaciones", title: "Mis asignaciones", Icon: BookMarked, color: "cyan", to: "mis-asignaciones" },
  ],
  ESTUDIANTE: [
    { key: "miGrupo",  title: "Mi grupo",  Icon: Users,      color: "cyan",   to: "mi-grupo"  },
    { key: "misNotas", title: "Mis Notas", Icon: TrendingUp, color: "orange", to: "mis-notas" },
  ],
  // Backward compat
  ADMIN: [
    { key: "docentes",    title: "Docentes",    Icon: UserCheck, color: "cyan",   to: "docentes"    },
    { key: "estudiantes", title: "Estudiantes", Icon: Users,     color: "green",  to: "estudiantes" },
    { key: "grados",      title: "Grados",      Icon: Layers,    color: "orange", to: "grados"      },
    { key: "materias",    title: "Materias",    Icon: BookOpen,  color: "red",    to: "materias"    },
  ],
};

const KPI_VALUE_MAP = {
  docentes:    "totalDocentes",
  estudiantes: "totalEstudiantes",
  grados:      "totalGrados",
  materias:    "totalMaterias",
};

const ADMIN_ROLES = new Set(["ADMIN_INSTITUCION", "ADMIN"]);

let _kpiCache = {};

export default function DashboardPage() {
  const { perfil, loadingPerfil } = useAuth();
  const { slug } = useParams();

  const [kpiValues, setKpiValues] = useState(_kpiCache);
  const [anioId,    setAnioId]    = useState(null);

  const rol = (perfil?.rol ?? "ADMIN").toUpperCase();

  useEffect(() => {
    if (!perfil || !ADMIN_ROLES.has(rol)) return;
    let active = true;
    obtenerAnioActivo()
      .then(anio => {
        if (!active || !anio?.id) return null;
        if (active) setAnioId(anio.id);
        return getDashboardKpis(anio.id);
      })
      .then(data => { if (active && data) { _kpiCache = data; setKpiValues(data); } })
      .catch(() => {});
    return () => { active = false; };
  }, [perfil, rol]);

  if (loadingPerfil) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!perfil) {
    return <Navigate to={`/${slug || ''}`} replace />;
  }

  if (rol === "SUPER_ADMIN") {
    return <Navigate to={`/${slug || 'super-admin'}/super-admin/instituciones`} replace />;
  }

  if (rol === "DOCENTE") {
    return <Navigate to={`/${slug}/mis-asignaciones`} replace />;
  }

  const kpis = KPI_CONFIG[rol] ?? KPI_CONFIG.ADMIN;

  return (
    <div className="p-2">
      <h5 className="text-xl font-bold text-gray-800 mb-0.5">
        {perfil?.nombres ? `Hola, ${perfil.nombres.split(" ")[0]}` : "Dashboard"}
      </h5>
      <p className="text-sm text-gray-400 mb-6">
        {perfil?.institucion?.nombre ?? ""}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map(kpi => {
          const apiKey = KPI_VALUE_MAP[kpi.key];
          const value = apiKey != null ? (kpiValues[apiKey] ?? "—") : undefined;
          return (
            <KpiCard
              key={kpi.key}
              title={kpi.title}
              value={value}
              Icon={kpi.Icon}
              color={kpi.color}
              to={`/${slug}/${kpi.to}`}
            />
          );
        })}
      </div>

      {ADMIN_ROLES.has(rol) && <DashboardStats anioId={anioId} />}
    </div>
  );
}