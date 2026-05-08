import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CalificacionesTable from "../../components/calificaciones/CalificacionesTable";
import { obtenerPlantillaAsignacion } from "../../services/calificaciones.service";
import { listarNotas } from "../../services/anio-academico.service";

export default function CalificarPage() {
  const navigate = useNavigate();
  const { slug, asignacionId } = useParams();
  const [searchParams] = useSearchParams();
  const anioId = searchParams.get("anioId");
  
  const [loading, setLoading] = useState(true);
  const [configNotas, setConfigNotas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [valoresIniciales, setValoresIniciales] = useState(new Map());
  const [asignacionInfo, setAsignacionInfo] = useState(null);
  const [error, setError] = useState(null);

  const cargarPlantilla = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Cargar configuración de notas del año
      const notasResponse = await listarNotas(anioId);
      const notas = notasResponse?.notas || [];
      setConfigNotas(notas);
      
      // 2. Cargar plantilla (asignación, estudiantes y valores guardados)
      const data = await obtenerPlantillaAsignacion(asignacionId, anioId);
      
      setAsignacionInfo(data.asignacion || {});
      setEstudiantes(data.estudiantes || []);
      
      const valoresMap = new Map();
      (data.valores || []).forEach(v => {
        const key = `${v.estudianteId}|${v.configuracionNotaId}|${v.corte}`;
        valoresMap.set(key, v.valor);
      });
      setValoresIniciales(valoresMap);
    } catch (err) {
      console.error("Error cargando plantilla:", err);
      setError("No se pudo cargar la información de la asignación");
    } finally {
      setLoading(false);
    }
  }, [asignacionId, anioId]);

  useEffect(() => {
    if (asignacionId && anioId) {
      cargarPlantilla();
    }
  }, [asignacionId, anioId, cargarPlantilla]);

  if (loading) {
    return (
      <div className="p-2 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/${slug}/mis-asignaciones`)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Calificación de estudiantes</h1>
            <p className="text-sm text-gray-400">
              {asignacionInfo?.materiaNombre || "Materia"} — {asignacionInfo?.gradoNombre || ""} • {asignacionInfo?.grupoNombre || ""}
            </p>
          </div>
        </div>
      </div>

      <CalificacionesTable
        configNotas={configNotas}
        estudiantes={estudiantes}
        valoresIniciales={valoresIniciales}
        asignacionId={asignacionId}
        anioId={anioId}
        loading={loading}
      />
    </div>
  );
}