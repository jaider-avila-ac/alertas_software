import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { procesarConsultas } from "../utils/procesarConsultas";
import { alertaVisual } from "../utils/alertaVisual";
import { AlertaCard } from "../components/AlertaCard";
import { ComboBox } from "../components/ComboBox";
import { Button } from "../components/Button";
import { Plus, ArrowLeft } from "lucide-react";
import { Esqueleto } from "../components/Esqueleto";
import { AlertasContext } from "../context/AlertasContext";
import { UserContext } from "../context/UserContext";

export const PageAlertas = () => {
  const { usuario } = useContext(UserContext);
  const { alertas, setAlertas } = useContext(AlertasContext);
  const [alertasFiltradas, setAlertasFiltradas] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [cargando, setCargando] = useState(true);
  const [nombreEstudiante, setNombreEstudiante] = useState("");

  const { estudianteId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from;

  useEffect(() => {
    const fetchAlertas = async () => {
      setCargando(true);
      try {
        const datos = await procesarConsultas();
        const procesadas = datos.map((c) => {
          const nivel = c.nivel?.toLowerCase();
          const visual = alertaVisual[nivel] || {};
          return {
            id: c.id,
            estudianteId: c.estudianteId,
            docenteId: c.docenteId,
            nombreEstudiante: c.nombreEstudiante || "Sin nombre",
            motivo: c.motivo || "Sin motivo",
            estado: c.estado || "pendiente",
            fecha: c.fecha ? new Date(c.fecha).toLocaleDateString() : "Sin fecha",
            nivel,
            icono: visual.icono,
            color: visual.color,
          };
        });

        setAlertas(procesadas);

        if (estudianteId) {
          const primero = procesadas.find(
            (a) => String(a.estudianteId) === estudianteId
          );
          if (primero) setNombreEstudiante(primero.nombreEstudiante);
        }
      } catch (error) {
        console.error("Error al cargar alertas:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchAlertas();
  }, [location.pathname, estudianteId]);

  useEffect(() => {
    if (!alertas || alertas.length === 0) {
      setAlertasFiltradas([]);
      return;
    }

    let filtradas = [...alertas];

    if (estudianteId) {
      filtradas = filtradas.filter(
        (a) => String(a.estudianteId) === estudianteId
      );
    }

    if (estadoFiltro !== "todos") {
      filtradas = filtradas.filter((a) => a.estado === estadoFiltro);
    }

    setAlertasFiltradas(filtradas);
  }, [alertas, estudianteId, estadoFiltro]);

  return (
    <main>
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {from === "dashboard" && (
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
          >
            <ArrowLeft size={16} />
            Volver al panel
          </button>
        )}
        {from === "consultas" && (
          <button
            onClick={() => navigate("/consultas")}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        )}
        <h2 className="text-2xl font-bold">
          {nombreEstudiante ? `Alertas de ${nombreEstudiante}` : "Todas las alertas"}
        </h2>
      </div>

      <div className="flex justify-between items-center gap-4 flex-wrap mb-2">
        <ComboBox
          opciones={["todos", "pendiente", "en_cita", "en_progreso", "completado"]}
          valor={estadoFiltro}
          onChange={setEstadoFiltro}
        />

        {usuario?.rol === 0 && (
          <Button
            text="Crear alerta"
            color="bg-pink-500"
            icon={Plus}
            onClick={() => navigate("/consultas/nueva")}
          />
        )}
      </div>

      <div className="text-sm text-gray-500 mb-4">
        {cargando ? "Cargando..." : `Mostrando ${alertasFiltradas.length} resultado(s)`}
      </div>

      <div className="space-y-2">
        {cargando
          ? Array(5)
              .fill(0)
              .map((_, i) => <Esqueleto key={i} className="h-24 w-full rounded" />)
          : alertasFiltradas.map((alerta) => (
              <AlertaCard key={alerta.id} alerta={alerta} />
            ))}
      </div>
    </main>
  );
};
