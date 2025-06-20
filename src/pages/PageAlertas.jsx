import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { procesarConsultas } from "../utils/procesarConsultas";
import { alertaVisual } from "../utils/alertaVisual";
import { AlertaCard } from "../components/AlertaCard";
import { BarraFiltros } from "../components/BarraFiltros";
import { Button } from "../components/Button";
import { Plus } from "lucide-react";
import { Layout } from "../layout/Layout";

export const PageAlertas = () => {
  const [alertas, setAlertas] = useState([]);
  const [alertasFiltradas, setAlertasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  const navigate = useNavigate();
  const usuario = { nombre: "Docente Demo", rol: "Docente" };

  useEffect(() => {
    const fetchAlertas = async () => {
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
      }
    };

    fetchAlertas();
  }, []);

  const filtrarPorTodo = (busquedaTexto, estado) => {
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
    const conteo = { todos: alertas.length, abierto: 0, completado: 0, pendiente: 0 };
    alertas.forEach((a) => {
      if (a.estado === "abierto") conteo.abierto++;
      if (a.estado === "completado") conteo.completado++;
      if (a.estado === "pendiente") conteo.pendiente++;
    });
    return conteo;
  };

  return (
    <Layout >
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

      <div className="space-y-2">
        {alertasFiltradas.map((alerta) => (
          <AlertaCard key={alerta.id} alerta={alerta} />
        ))}
      </div>
    </Layout>
  );
};
