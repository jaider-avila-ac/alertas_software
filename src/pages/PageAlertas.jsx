import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { procesarConsultas } from "../utils/procesarConsultas";
import { alertaVisual } from "../utils/alertaVisual";
import { AlertaCard } from "../components/AlertaCard";
import { BarraFiltros } from "../components/BarraFiltros";
import { Button } from "../components/Button";
import { Plus } from "lucide-react";
import { Layout } from "../layout/Layout";
import { Esqueleto } from "../components/Esqueleto";
import { AlertasContext } from "../context/AlertasContext";

export const PageAlertas = () => {
  const { alertas, setAlertas } = useContext(AlertasContext);
  const [alertasFiltradas, setAlertasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [cargando, setCargando] = useState(true);

  const [searchParams] = useSearchParams();
  const estudianteIdParam = searchParams.get("estudianteId");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlertas = async () => {
      if (!alertas) {
        try {
          const datos = await procesarConsultas();
          const procesadas = datos.map((c) => {
            const nivel = c.nivel?.toLowerCase();
            const visual = alertaVisual[nivel] || {};
            return {
              id: c.id,
              estudianteId: c.estudianteId,
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
        } catch (error) {
          console.error("Error al cargar alertas:", error);
        } finally {
          setCargando(false);
        }
      } else {
        setCargando(false);
      }
    };

    fetchAlertas();
  }, [alertas, setAlertas]);

  useEffect(() => {
    if (!alertas) return;

    let filtradas = [...alertas];

    if (estadoFiltro !== "todos") {
      filtradas = filtradas.filter((a) => a.estado === estadoFiltro);
    }

    if (estudianteIdParam && estadoFiltro === "todos" && !busqueda) {
  filtradas = filtradas.filter(
    (a) =>
      String(a.estudianteId) === estudianteIdParam &&
      a.estado !== "completado" &&
      a.estado !== "en_cita"
  );
}

    if (busqueda) {
      filtradas = filtradas.filter((a) =>
        a.nombreEstudiante.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setAlertasFiltradas(filtradas);
  }, [alertas, estudianteIdParam, busqueda, estadoFiltro]);

  const handleBuscar = (texto) => {
    setBusqueda(texto);
  };

  const handleFiltrarEstado = (estado) => {
    setEstadoFiltro(estado);
    if (estado === "todos" && estudianteIdParam) {
      navigate("/consultas");
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold">Todas las alertas</h2>

      <div className="flex justify-between items-start gap-4 flex-wrap w-full">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[250px]">
          <BarraFiltros
            valorBusqueda={busqueda}
            onBuscar={handleBuscar}
            mostrarFiltroEstado={true}
            estadoActual={estadoFiltro}
            onFiltrarEstado={handleFiltrarEstado}
            placeholder="Buscar por nombre del estudiante"
          />
        </div>

        <div>
          <Button
            text="Crear alerta"
            color="bg-pink-500"
            icon={Plus}
            onClick={() => navigate("/consultas/nueva")}
          />
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-500">
        Mostrando {alertasFiltradas.length} resultado(s)
      </div>

      <div className="space-y-2 mt-4">
        {cargando
          ? Array(5)
              .fill(0)
              .map((_, i) => <Esqueleto key={i} className="h-24 w-full rounded" />)
          : alertasFiltradas.map((alerta) => (
              <AlertaCard key={alerta.id} alerta={alerta} />
            ))}
      </div>
    </Layout>
  );
};
