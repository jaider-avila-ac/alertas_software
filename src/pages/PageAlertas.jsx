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
          console.error("❌ Error al cargar alertas:", error);
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

    // 1. Filtro por estudianteId sin búsqueda ni estado
    if (estudianteIdParam && !busqueda && estadoFiltro === "todos") {
      filtradas = filtradas.filter((a) => String(a.estudianteId) === estudianteIdParam);
    }

    // 2. Filtro general por estado === "todos"
    if (estadoFiltro === "todos") {
      filtradas = filtradas.filter(
        (a) =>
          a.estado === "pendiente" ||
          a.estado === null ||
          a.estado === "en_progreso"
      );
    }

    // 3. Filtro por estado específico
    if (estadoFiltro !== "todos") {
      filtradas = filtradas.filter((a) => a.estado === estadoFiltro);
    }

    // 4. Filtro por búsqueda
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

  const contarPorEstado = () => {
    const conteo = {
      todos: alertas?.length || 0,
      abierto: 0,
      completado: 0,
      pendiente: 0,
      en_progreso: 0,
    };
    alertas?.forEach((a) => {
      if (a.estado === "abierto") conteo.abierto++;
      if (a.estado === "completado") conteo.completado++;
      if (a.estado === "pendiente") conteo.pendiente++;
      if (a.estado === "en_progreso") conteo.en_progreso++;
    });
    return conteo;
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold">Todas las alertas</h2>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <BarraFiltros
          valorBusqueda={busqueda}
          onBuscar={handleBuscar}
          mostrarFiltroEstado={true}
          estados={["todos", "pendiente", "en_progreso", "completado"]} // puedes ajustar aquí los filtros visibles
          totales={contarPorEstado()}
          onFiltrarEstado={handleFiltrarEstado}
          placeholder="Buscar por nombre del estudiante…"
        />

        <Button
          text="Crear alerta"
          color="bg-pink-500"
          icon={Plus}
          onClick={() => navigate("/consultas/nueva")}
        />
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
