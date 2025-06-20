import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerSeguimientosPorConsulta } from "../services/seguimientoService";
import { Layout } from "../layout/Layout";
import { Table } from "../components/Table";

export const SeguimientosPorConsulta = () => {
  const { id } = useParams(); // este id de la consulta
  const [searchParams] = useSearchParams();
  const nombreEstudiante = searchParams.get("estudiante");

  const [seguimientos, setSeguimientos] = useState([]);

  useEffect(() => {
    const fetchSeguimientos = async () => {
      try {
        const res = await obtenerSeguimientosPorConsulta(id);
        const datos = res.data.map((s) => ({
          Fecha: new Date(s.fecha).toLocaleDateString(),
          Estado: s.estado,
          Seguimiento: s.seguimiento,
          Observaciones: s.obs || "-",
        }));
        setSeguimientos(datos);
      } catch (error) {
        console.error("Error al cargar seguimientos:", error);
        setSeguimientos([]);
      }
    };
    fetchSeguimientos();
  }, [id]);

  return (
    <Layout>
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <h2 className="text-2xl font-bold">
          Seguimientos de alerta #{id} – {nombreEstudiante}
        </h2>

        {seguimientos.length > 0 ? (
          <Table
            columns={["Fecha", "Estado", "Seguimiento", "Observaciones"]}
            data={seguimientos}
          />
        ) : (
          <p className="italic text-gray-600">No hay seguimientos registrados.</p>
        )}
      </main>
    </Layout>
  );
};
