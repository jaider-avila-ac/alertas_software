import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerSeguimientosPorConsulta } from "../services/seguimientoService";
import { obtenerObservacionesPorSeguimiento } from "../services/observacionService";
import { Layout } from "../layout/Layout";
import { Table } from "../components/Table";
import { Esqueleto } from "../components/Esqueleto";

export const SeguimientosPorConsulta = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const nombreEstudiante = searchParams.get("estudiante") || "Estudiante";

  const [datosTabla, setDatosTabla] = useState([]);
  const [observaciones, setObservaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resSeg = await obtenerSeguimientosPorConsulta(id);
        const seguimiento = resSeg.data;

        if (seguimiento && seguimiento.id) {
          const resObs = await obtenerObservacionesPorSeguimiento(seguimiento.id);
          const observacionesData = resObs.data || [];

          const fila = {
            Fecha: seguimiento.fechaInicio
              ? new Date(seguimiento.fechaInicio).toLocaleDateString()
              : "Sin fecha",
            Estado: seguimiento.consulta?.estado || "No definido",
            Seguimiento: seguimiento.consulta?.motivo || "Sin motivo",
          };

          setDatosTabla([fila]);

          // Ordenar observaciones por fecha ascendente
          const ordenadas = observacionesData.sort(
            (a, b) => new Date(a.fecha) - new Date(b.fecha)
          );
          setObservaciones(ordenadas);
        } else {
          setDatosTabla([]);
          setObservaciones([]);
        }
      } catch (error) {
        console.error("Error al cargar seguimiento y observaciones:", error);
        setDatosTabla([]);
        setObservaciones([]);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  return (
    <Layout>
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <h2 className="text-2xl font-bold">
          Seguimiento de alerta #{id} – {decodeURIComponent(nombreEstudiante)}
        </h2>

        {cargando ? (
          <Esqueleto className="h-32 w-full rounded" />
        ) : (
          <>
            <Table columns={["Fecha", "Estado", "Seguimiento"]} data={datosTabla} />

            <section className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Observaciones</h3>
              {observaciones.length > 0 ? (
                <ul className="space-y-4">
                  {observaciones.map((obs, index) => (
                    <li key={index} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                      <p className="text-sm text-gray-500 mb-1">
                        {new Date(obs.fecha).toLocaleString()}
                      </p>
                      <p className="text-gray-800 whitespace-pre-wrap">{obs.texto}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-gray-600">No hay observaciones registradas.</p>
              )}
            </section>
          </>
        )}
      </main>
    </Layout>
  );
};
