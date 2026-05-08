import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerSeguimientosPorConsulta } from "../services/seguimientoService";
import { obtenerObservacionesPorSeguimiento } from "../services/observacionService";
import DataTable from "../components/ui/DataTable";
import { Esqueleto } from "../components/Esqueleto";

const COLUMNS = [
  { key: "estado",      label: "Estado",      sortable: false },
  { key: "seguimiento", label: "Seguimiento", sortable: false },
  { key: "fecha",       label: "Fecha",       sortable: false },
];

export const SeguimientosPorConsulta = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const nombreEstudiante = searchParams.get("estudiante") || "Estudiante";

  const [filas,         setFilas]         = useState([]);
  const [observaciones, setObservaciones] = useState([]);
  const [cargando,      setCargando]      = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resSeg = await obtenerSeguimientosPorConsulta(id);
        const seguimiento = resSeg.data;

        if (seguimiento?.id) {
          const resObs = await obtenerObservacionesPorSeguimiento(seguimiento.id);
          const observacionesData = resObs.data || [];

          setFilas([{
            id:          seguimiento.id,
            estado:      seguimiento.consulta?.estado || "No definido",
            seguimiento: seguimiento.consulta?.motivo || "Sin motivo",
            fecha:       seguimiento.fechaInicio
              ? new Date(seguimiento.fechaInicio).toLocaleDateString()
              : "Sin fecha",
          }]);

          setObservaciones(
            observacionesData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
          );
        } else {
          setFilas([]);
          setObservaciones([]);
        }
      } catch (error) {
        console.error("Error al cargar seguimiento y observaciones:", error);
        setFilas([]);
        setObservaciones([]);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  return (
    <main className="space-y-6">
      <h2 className="text-2xl font-bold">
        Seguimiento de alerta #{id} – {decodeURIComponent(nombreEstudiante)}
      </h2>

      {cargando ? (
        <Esqueleto className="h-32 w-full rounded" />
      ) : (
        <>
          <DataTable
            columns={COLUMNS}
            rows={filas}
            empty="Sin seguimiento registrado."
          />

          <section className="mt-4">
            <h3 className="text-xl font-semibold mb-4">Observaciones</h3>
            {observaciones.length > 0 ? (
              <ul className="space-y-4">
                {observaciones.map((obs, index) => (
                  <li
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-pink-400"
                  >
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
  );
};
