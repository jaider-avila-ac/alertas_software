import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import { listarEstudiantesDeGrupo } from "../../services/grupos.service";
import { get } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const COLUMNS_ADMIN = [
  { key: "documento", label: "Documento" },
  { key: "nombres",   label: "Nombres y apellidos", render: (_, r) => `${r.nombres} ${r.apellidos}` },
];

const COLUMNS_ESTUDIANTE = [
  { key: "nombres", label: "Nombres y apellidos", render: (_, r) => `${r.nombres} ${r.apellidos}` },
];

export default function GrupoEstudiantesPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { grupoId } = useParams();
  const { state } = useLocation();
  const { perfil, loadingPerfil } = useAuth();
  const rol = perfil?.rol?.toUpperCase();

  const anioId = state?.anio?.id;

  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtitulo, setSubtitulo] = useState("Cargando...");
  const esEstudiante = rol === "ESTUDIANTE";
  const [miGrupoId, setMiGrupoId] = useState(null);

  useEffect(() => {
    // Esperar a que el perfil cargue para evitar ejecutar el path incorrecto
    if (loadingPerfil) return;

    if (rol === "ESTUDIANTE" && perfil?.personaId) {
      const obtenerMiGrupo = async () => {
        setLoading(true);
        try {
          const anioActivo = await get("/anios/activo").then(r => r.data);
          const matricula = await get(`/matriculas/estudiante/${perfil.personaId}/anio/${anioActivo.id}`)
            .then(r => r.data);
          if (matricula?.grupo?.id) {
            setMiGrupoId(matricula.grupo.id);
            const gradoNom = matricula.grado?.nombre ?? "";
            const grupoNom = matricula.grupo.nombre ?? "";
            setSubtitulo(`${gradoNom}${gradoNom && grupoNom ? " — " : ""}${grupoNom} · Año ${anioActivo.anio}`);
          } else {
            setSubtitulo("No se encontró tu grupo");
          }
        } catch (error) {
          console.error("Error obteniendo grupo del estudiante:", error);
          setSubtitulo("No se pudo obtener tu grupo");
        } finally {
          setLoading(false);
        }
      };
      obtenerMiGrupo();
    } else if (grupoId && anioId) {
      const cargarGrupoNormal = async () => {
        try {
          const anioActual = await get("/anios/activo").then(r => r.data).catch(() => null);
          const data = await listarEstudiantesDeGrupo(grupoId, anioId);
          const ordenados = [...data].sort((a, b) =>
            `${a.nombres} ${a.apellidos}`.localeCompare(`${b.nombres} ${b.apellidos}`)
          );
          setEstudiantes(ordenados);
          const gradoNom = state?.grado?.nombre ?? "";
          const grupoNom = state?.grupo?.nombre ?? `Grupo ${grupoId}`;
          const anioNom  = anioActual?.anio ?? anioId;
          setSubtitulo(`${gradoNom}${gradoNom ? " — " : ""}${grupoNom} · Año ${anioNom}`);
        } catch (error) {
          console.error("Error cargando estudiantes:", error);
          setSubtitulo("Error al cargar los estudiantes");
        } finally {
          setLoading(false);
        }
      };
      cargarGrupoNormal();
    } else {
      const setEstadoVacio = async () => {
        setLoading(false);
        setSubtitulo("Información del grupo no disponible");
      };
      setEstadoVacio();
    }
  }, [loadingPerfil, rol, perfil, grupoId, anioId, state]);

  // Una vez que se sabe el grupo del estudiante, cargar sus compañeros
  useEffect(() => {
    if (esEstudiante && miGrupoId) {
      const cargarEstudiantesDeMiGrupo = async () => {
        setLoading(true);
        try {
          const anioActivo = await get("/anios/activo").then(r => r.data);
          const data = await listarEstudiantesDeGrupo(miGrupoId, anioActivo.id);
          const ordenados = [...data].sort((a, b) =>
            `${a.nombres} ${a.apellidos}`.localeCompare(`${b.nombres} ${b.apellidos}`)
          );
          setEstudiantes(ordenados);
        } catch (error) {
          console.error("Error cargando estudiantes del grupo:", error);
          setSubtitulo("Error al cargar los estudiantes");
        } finally {
          setLoading(false);
        }
      };
      cargarEstudiantesDeMiGrupo();
    }
  }, [esEstudiante, miGrupoId]);

  const handleVolver = () => {
    if (esEstudiante) {
      navigate(`/${slug}/dashboard`);
    } else {
      navigate(`/${slug}/grados`);
    }
  };

  const handleVerEstudiante = (row) => {
    if (esEstudiante && row.id !== perfil?.personaId) return;
    navigate(
      `/${slug}/estudiantes/notas/${row.id}`,
      { state: { estudiante: row, anio: state?.anio, grupo: state?.grupo, grado: state?.grado, desde: esEstudiante ? "mi-perfil" : "grupo" } }
    );
  };

  const renderAcciones = row => {
    if (esEstudiante && row.id !== perfil?.personaId) return null;
    return (
      <button
        onClick={() => handleVerEstudiante(row)}
        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors"
      >
        {esEstudiante && row.id === perfil?.personaId ? "Mi perfil" : "Ver estudiante"}
      </button>
    );
  };

  // Cargando grupo del estudiante
  if ((loadingPerfil || loading) && esEstudiante && !miGrupoId) {
    return (
      <div className="p-2 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={handleVolver} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Mi grupo</h2>
            <p className="text-sm text-gray-400">Cargando información...</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-3"></div>
          Obteniendo tu grupo...
        </div>
      </div>
    );
  }

  // Estudiante sin grupo matriculado
  if (esEstudiante && !miGrupoId && !loading && !loadingPerfil) {
    return (
      <div className="p-2 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={handleVolver} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Mi grupo</h2>
            <p className="text-sm text-gray-400">{subtitulo}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400">
          <Users size={32} className="mx-auto mb-2 text-gray-300" />
          No se encontró información de tu grupo. Contacta al administrador.
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-4">

      <div className="flex items-center gap-3">
        <button
          onClick={handleVolver}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {esEstudiante ? "Mi grupo" : "Estudiantes del grupo"}
          </h2>
          <p className="text-sm text-gray-400">{subtitulo}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm" style={{ height: 600 }}>
        <div className="p-4 flex flex-col h-full">
          <DataTable
            columns={esEstudiante ? COLUMNS_ESTUDIANTE : COLUMNS_ADMIN}
            rows={estudiantes}
            actions={esEstudiante ? null : renderAcciones}
            loading={loading}
            empty="No hay estudiantes matriculados en este grupo."
            defaultSort={{ key: "nombres", dir: "asc" }}
            searchKeys={esEstudiante ? ["nombres", "apellidos"] : ["nombres", "apellidos", "documento"]}
            pageSize={50}
          />
        </div>
      </div>

      {esEstudiante && !loading && (
        <div className="text-center text-xs text-gray-400 mt-2">
          Solo puedes ver tu propia información académica.
        </div>
      )}
    </div>
  );
}
