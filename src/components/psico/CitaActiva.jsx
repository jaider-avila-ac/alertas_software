import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import { Layout } from "../../layout/Layout";
import {
  obtenerCitaPorId,
  cambiarEstadoCita,
} from "../../services/citaService";
import {
  crearSeguimiento,
  obtenerSeguimientosPorConsulta,
} from "../../services/seguimientoService";
import {
  obtenerObservacionesPorSeguimiento,
  crearObservacion,
} from "../../services/observacionService";
import {
  buscarConsultaPorEstudiante,
  cambiarEstadoConsulta,
} from "../../services/consultaService";
import { ComboBox } from "../ComboBox";

export const CitaActiva = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cita, setCita] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [seguimientos, setSeguimientos] = useState({});
  const [observaciones, setObservaciones] = useState({});
  const [textoNuevo, setTextoNuevo] = useState({});
  const [estadoConsulta, setEstadoConsulta] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await obtenerCitaPorId(id);
        const citaData = res.data;
        setCita(citaData);

        const estudianteId = citaData.estudiante?.id;
        if (!estudianteId) return;

        const resConsultas = await buscarConsultaPorEstudiante(estudianteId);
        const consultasFiltradas = resConsultas.data.filter(
          (c) => c.estado === "en_cita"
        );

        const seguimientosMap = {};
        const observacionesMap = {};

        for (const consulta of consultasFiltradas) {
          const resp = await obtenerSeguimientosPorConsulta(consulta.id);
          let seguimiento = resp.data;

          if (!seguimiento?.id) {
            const nuevo = await crearSeguimiento({ consultaId: consulta.id });
            seguimiento = nuevo.data;
          }

          seguimientosMap[consulta.id] = seguimiento.id;

          const resObs = await obtenerObservacionesPorSeguimiento(seguimiento.id);
          observacionesMap[consulta.id] = resObs.data || [];
        }

        setConsultas(consultasFiltradas);
        setSeguimientos(seguimientosMap);
        setObservaciones(observacionesMap);
      } catch (err) {
        console.error("Error al cargar cita:", err);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [id]);

  const manejarCambioTexto = (consultaId, texto) => {
    setTextoNuevo((prev) => ({ ...prev, [consultaId]: texto }));
  };

  const cambiarEstado = (consultaId, nuevoEstado) => {
    setEstadoConsulta((prev) => ({ ...prev, [consultaId]: nuevoEstado }));
  };

  const guardarObservacion = async (consultaId) => {
    const texto = textoNuevo[consultaId];
    const seguimientoId = seguimientos[consultaId];
    if (!texto || !seguimientoId) return;

    await crearObservacion({
      texto,
      seguimiento: { id: seguimientoId },
    });

    const resObs = await obtenerObservacionesPorSeguimiento(seguimientoId);
    setObservaciones((prev) => ({ ...prev, [consultaId]: resObs.data || [] }));
    setTextoNuevo((prev) => ({ ...prev, [consultaId]: "" }));
  };

  const finalizarCita = async () => {
    for (const consulta of consultas) {
      const texto = textoNuevo[consulta.id];
      const estado = estadoConsulta[consulta.id];

      if (!texto?.trim() || !estado) {
        alert(" Cada consulta debe tener observación escrita y estado seleccionado.");
        return;
      }

      await guardarObservacion(consulta.id);
      await cambiarEstadoConsulta(consulta.id, estado);
    }

    await cambiarEstadoCita(id, "usada");
    navigate("/psicorientador/citas");
  };

  const volver = () => {
    navigate("/psicorientador/citas");
  };

  if (cargando || !cita) return <p className="p-6">Cargando cita...</p>;

  return (
    <Layout>
      <main className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">
          Seguimiento de cita #{id} – {cita.estudiante?.nombres} {cita.estudiante?.apellidos}
        </h2>

        {consultas.length === 0 ? (
          <p className="italic">No hay consultas en estado 'en_cita' para este estudiante.</p>
        ) : (
          consultas.map((consulta) => (
            <div key={consulta.id} className="bg-white p-4 rounded shadow space-y-2">
              <p className="font-semibold">Motivo: {consulta.motivo}</p>

              <div className="space-y-2">
                <h4 className="text-sm text-gray-600 font-medium">Observaciones anteriores:</h4>
                {observaciones[consulta.id]?.length > 0 ? (
                  <ul className="text-sm text-gray-800 space-y-1">
                    {observaciones[consulta.id].map((obs, i) => (
                      <li key={i} className="border-l-4 border-blue-500 pl-2">
                        <p className="text-gray-500 text-xs mb-0.5">
                          {new Date(obs.fecha).toLocaleString()}
                        </p>
                        <p>{obs.texto}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-sm text-gray-500">Sin observaciones aún.</p>
                )}
              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-600 font-medium block mb-1">
                  Nueva observación:
                </label>
                <textarea
                  rows={3}
                  className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Escriba la observación de esta cita para esta consulta..."
                  value={textoNuevo[consulta.id] || ""}
                  onChange={(e) => manejarCambioTexto(consulta.id, e.target.value)}
                />
              </div>

              <ComboBox
                opciones={["en_progreso", "completado"]}
                valor={estadoConsulta[consulta.id] || ""}
                onChange={(valor) => cambiarEstado(consulta.id, valor)}
                label="Estado de la consulta"
              />
            </div>
          ))
        )}

        <div className="flex gap-4 mt-6">
          <Button text="Volver" color="bg-gray-600" onClick={volver} />
          <Button text="Finalizar cita" color="bg-blue-600" onClick={finalizarCita} />
        </div>
      </main>
    </Layout>
  );
};
