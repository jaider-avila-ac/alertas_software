import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerTodasConsultas } from "../services/consultaService";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { alertaVisual } from "../utils/alertaVisual";
import { AlertaCard } from "../components/AlertaCard";
import { BarraFiltros } from "../components/BarraFiltros";

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
        const res = await obtenerTodasConsultas();

        const procesadas = res.data.map((c) => {
          const nivel = c.alerta?.toLowerCase();
          const visual = alertaVisual[nivel] || {};
          const fecha = new Date(c.fecha).toLocaleDateString();

          return {
            id: c.id,
            nombre: `${c.estudianteNombres} ${c.estudianteApellidos}`,
            motivo: c.motivo,
            fecha,
            estado: c.estado?.toLowerCase(),
            nivel,
            icono: visual.icono,
            color: visual.color,
          };
        });

        setAlertas(procesadas);
        setAlertasFiltradas(procesadas); // mostrar todas al principio
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
    const conteo = { todos: alertas.length, abierto: 0, completado: 0 };
    alertas.forEach((a) => {
      if (a.estado === "abierto") conteo.abierto++;
      if (a.estado === "completado") conteo.completado++;
    });
    return conteo;
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header nombre={usuario.nombre} rol={usuario.rol} />
        <main className="p-4 space-y-4">
          <h2 className="text-2xl font-bold">Todas las alertas</h2>

          <BarraFiltros
            valorBusqueda={busqueda}
            onBuscar={handleBuscar}
            onAgregar={() => navigate("/crear-alerta")}
            mostrarFiltroEstado={true}
            estados={["todos", "abierto", "completado"]}
            totales={contarPorEstado()}
            onFiltrarEstado={handleFiltrarEstado}
            placeholder="Buscar por nombre del estudiante…"
          />

          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
            {alertasFiltradas.map((alerta) => (
              <AlertaCard key={alerta.id} alerta={alerta} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
