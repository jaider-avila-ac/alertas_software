import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, BookOpen, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { get } from "../../services/api";
import { obtenerAnioActivo } from "../../services/anio-academico.service"; 

export default function MisAsignacionesPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { perfil } = useAuth();
  const [asignaciones, setAsignaciones] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [anioInfo, setAnioInfo] = useState(null);

  useEffect(() => {
    const cargarAsignaciones = async () => {
      try {
        // Obtener año activo usando el servicio correcto
        const anio = await obtenerAnioActivo(); // ← Cambia esta línea
        setAnioInfo(anio);

        // Obtener asignaciones del docente
        const asignacionesResp = await get(`/asignaciones/docente/${perfil?.personaId}`);
        const data = asignacionesResp.data || [];
        setAsignaciones(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error cargando asignaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    if (perfil?.personaId) {
      cargarAsignaciones();
    }
  }, [perfil]);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFiltered(asignaciones);
    } else {
      const filtered = asignaciones.filter(a => 
        (a.materiaNombre || "").toLowerCase().includes(term) ||
        (a.gradoNombre || "").toLowerCase().includes(term) ||
        (a.grupoNombre || "").toLowerCase().includes(term)
      );
      setFiltered(filtered);
    }
  }, [searchTerm, asignaciones]);

  const handleSeleccionarAsignacion = (asignacionId) => {
    navigate(`/${slug}/calificar/${asignacionId}?anioId=${anioInfo?.id}`);
  };

  if (loading) {
    return (
      <div className="p-2 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-800">Mis asignaciones</h2>
        <p className="text-sm text-gray-400">
          Selecciona una materia para calificar
          {anioInfo && <span className="ml-2 text-cyan-500">• Año: {anioInfo.anio}</span>}
        </p>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por materia, grado o grupo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {/* Lista de asignaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(asig => (
          <button
            key={asig.id}
            onClick={() => handleSeleccionarAsignacion(asig.id)}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-left hover:shadow-md transition-all hover:border-cyan-200 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-cyan-600 transition-colors">
                  {asig.materiaNombre || "Materia"}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {asig.gradoNombre || "Grado"}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={14} />
                    {asig.grupoNombre || "Grupo"}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                <BookOpen size={16} className="text-cyan-500" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400">
          No tienes asignaciones para este año académico
        </div>
      )}
    </div>
  );
}