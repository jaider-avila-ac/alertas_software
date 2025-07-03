import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerTodasConsultas } from "../services/consultaService";

import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { BarraFiltros } from "../components/BarraFiltros";

export const AlertasPage = () => {
  const [alertas, setAlertas] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("pendiente");
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarAlertas = async () => {
      try {
        const res = await obtenerTodasConsultas();
        setAlertas(res.data || []);
      } catch (error) {
        console.error("Error cargando alertas:", error);
      }
    };
    cargarAlertas();
  }, []);

  const estados = ["pendiente", "en progreso", "completado"];

  const alertasFiltradas = alertas.filter(
    (a) =>
      a.estado?.toLowerCase() === estadoFiltro.toLowerCase() &&
      (a.motivo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        a.nivel?.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const alertasCompletadas = alertas.filter((a) =>
    a.estado?.toLowerCase() === "completado"
  );

  return (
    <div>
      <main className="space-y-6">
        <h2 className="text-2xl font-bold">Gestión de Alertas</h2>

        <BarraFiltros
          valorBusqueda={busqueda}
          onBuscar={setBusqueda}
          mostrarFiltroEstado
          estados={estados}
          onFiltrarEstado={setEstadoFiltro}
        />

        <section>
          <h3 className="text-xl font-semibold mb-2 capitalize">
            Alertas {estadoFiltro}
          </h3>
          {alertasFiltradas.length > 0 ? (
            <Table
              columns={["ID", "Motivo", "Fecha", "Estado", "Nivel", "Ver Seguimientos"]}
              data={alertasFiltradas.map((a) => ({
                ID: a.id,
                Motivo: a.motivo,
                Fecha: new Date(a.fecha).toLocaleDateString(),
                Estado: a.estado,
                Nivel: a.nivel,
                "Ver Seguimientos": (
                  <Button
                    text="Ver"
                    color="bg-green-600"
                    onClick={() =>
                      navigate(`/seguimientos/${a.id}?estudiante=${a.estudiante?.nombres} ${a.estudiante?.apellidos}`)
                    }
                  />
                ),
              }))}
            />
          ) : (
            <p className="italic text-gray-600">No hay alertas en este estado.</p>
          )}
        </section>

        <section>
          <h3 className="text-xl font-semibold mt-6 mb-2">Alertas completadas</h3>
          {alertasCompletadas.length > 0 ? (
            <Table
              columns={["ID", "Motivo", "Fecha", "Estado", "Nivel", "Ver Seguimientos"]}
              data={alertasCompletadas.map((a) => ({
                ID: a.id,
                Motivo: a.motivo,
                Fecha: new Date(a.fecha).toLocaleDateString(),
                Estado: a.estado,
                Nivel: a.nivel,
                "Ver Seguimientos": (
                  <Button
                    text="Ver"
                    color="bg-green-600"
                    onClick={() =>
                      navigate(`/seguimientos/${a.id}?estudiante=${a.estudiante?.nombres} ${a.estudiante?.apellidos}`)
                    }
                  />
                ),
              }))}
            />
          ) : (
            <p className="italic text-gray-600">No hay alertas completadas.</p>
          )}
        </section>
      </main>
    </div>
  );
};
