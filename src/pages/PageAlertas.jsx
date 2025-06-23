import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlertas = async () => {
      if (!alertas) {
        try {
          const datos = await procesarConsultas();
          const procesadas = datos.map((c) => {
            const nivel = c.alerta?.toLowerCase();
            const visual = alertaVisual[nivel] || {};
            return {
              ...c,
              nivel,
              icono: visual.icono,
              color: visual.color,
              fecha: c.fecha ? new Date(c.fecha).toLocaleDateString() : "Sin fecha",
            };
          });
          setAlertas(procesadas);
          setAlertasFiltradas(procesadas);
        } catch (error) {
          console.error("Error al cargar alertas:", error);
        } finally {
          setCargando(false);
        }
      } else {
        setAlertasFiltradas(alertas);
        setCargando(false);
      }
    };

    fetchAlertas();
  }, [alertas, setAlertas]);

  const filtrarPorTodo = (busquedaTexto, estado) => {
    if (!alertas) return;
    let filtradas = [...alertas];

    if (estado !== "todos") {
      filtradas = filtradas.filter((a) => a.estado === estado);
    }

    if (busquedaTexto) {
      filtradas = filtradas.filter((a) =>
        a.nombre.toLowerCase().includes(busquedaTexto.toLowerCase())
      );
    }

    setAlertasFiltradas(filtradas);
  };

  const handleBuscar = (texto) => {
    setBusqueda(texto);
    filtrarPorTodo(texto, estadoFiltro);
  };

  const handleFiltrarEstado = (estado) => {
    setEstadoFiltro(estado);
    filtrarPorTodo(busqueda, estado);
  };

  const contarPorEstado = () => {
    const conteo = { todos: alertas?.length || 0, abierto: 0, completado: 0, pendiente: 0 };
    alertas?.forEach((a) => {
      if (a.estado === "abierto") conteo.abierto++;
      if (a.estado === "completado") conteo.completado++;
      if (a.estado === "pendiente") conteo.pendiente++;
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
          estados={["todos", "abierto", "completado"]}
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
