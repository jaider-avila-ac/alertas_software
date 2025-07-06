import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Button } from "../Button";
import { ResumenGeneral } from "../psico/ResumenGeneral";
import {
  obtenerCitaPorId,
  cambiarEstadoCita,
} from "../../services/citaService";
import {
  crearSeguimiento,
  obtenerSeguimientosPorConsulta,
  generarResumenIA,
  guardarResumenGeneral,
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
import { NotificacionFlotante } from "../NotificacionFlotante";
import { UserContext } from "../../context/UserContext";

export const CitaActiva = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(UserContext);

  const [cita, setCita] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [seguimientos, setSeguimientos] = useState({});
  const [observaciones, setObservaciones] = useState({});
  const [textoNuevo, setTextoNuevo] = useState({});
  const [estadoConsulta, setEstadoConsulta] = useState({});
  const [resumenGeneral, setResumenGeneral] = useState("");
  const [idSeguimientoGeneral, setIdSeguimientoGeneral] = useState(null);
  const [mostrarCampoResumen, setMostrarCampoResumen] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [notificacion, setNotificacion] = useState(null);
  const [citaFinalizada, setCitaFinalizada] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await obtenerCitaPorId(id);
        const citaData = res.data;
        setCita(citaData);

        if (citaData.estado === "usada") {
          setCitaFinalizada(true);
          return;
        }

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
            const nuevo = await crearSeguimiento({
              consulta: { id: consulta.id },
              psicorientador: { id: usuario.id },
              fechaInicio: new Date().toISOString().slice(0, 10),
            });
            seguimiento = nuevo.data;
          }

          if (!idSeguimientoGeneral) {
            setResumenGeneral(seguimiento.resumenGeneral || "");
            setIdSeguimientoGeneral(seguimiento.id);
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
        setNotificacion({
          mensaje: "Error al cargar los datos de la cita.",
          tipo: "error",
        });
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [id, usuario.id]);

  const manejarCambioTexto = (consultaId, texto) => {
    setTextoNuevo((prev) => ({ ...prev, [consultaId]: texto }));
  };

  const cambiarEstado = (consultaId, nuevoEstado) => {
    setEstadoConsulta((prev) => ({ ...prev, [consultaId]: nuevoEstado }));
  };

  const guardarObservacion = async (consultaId) => {
    const texto = textoNuevo[consultaId];
    const seguimientoId = seguimientos[consultaId];
    if (!texto?.trim() || !seguimientoId) return;

    await crearObservacion({ texto, seguimiento: { id: seguimientoId } });

    const resObs = await obtenerObservacionesPorSeguimiento(seguimientoId);
    setObservaciones((prev) => ({ ...prev, [consultaId]: resObs.data || [] }));
    setTextoNuevo((prev) => ({ ...prev, [consultaId]: "" }));
  };

  const finalizarCita = async () => {
    for (const consulta of consultas) {
      const idConsulta = consulta.id;
      const texto = textoNuevo[idConsulta];
      const estado = estadoConsulta[idConsulta];
      const seguimientoId = seguimientos[idConsulta];
      const tieneObservaciones = observaciones[idConsulta]?.length > 0;
      const tieneTextoNuevo = texto?.trim();

      if (!estado || (!tieneObservaciones && !tieneTextoNuevo)) {
        setNotificacion({
          mensaje: "Cada consulta debe tener observación y estado.",
          tipo: "error",
        });
        return;
      }

      if (tieneTextoNuevo) {
        await guardarObservacion(idConsulta);
      }

      await cambiarEstadoConsulta(idConsulta, estado);
    }

    await cambiarEstadoCita(id, "usada");
    setMostrarCampoResumen(true);
  };

  const generarResumen = async () => {
    try {
      const res = await generarResumenIA(idSeguimientoGeneral);
      return res.data; // Se delega la notificación al componente ResumenGeneral
    } catch (error) {
      console.error("Error al generar resumen:", error);
      return "ERROR_INTERNO";
    }
  };

  const guardarResumen = async () => {
    await guardarResumenGeneral(idSeguimientoGeneral, resumenGeneral);
    navigate("/citas");
  };

  if (cargando) return <p className="p-6">Cargando cita...</p>;
  if (citaFinalizada) {
    return (
      <div className="p-6 text-center space-y-4 flex flex-col items-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Esta cita ya fue finalizada.
        </h2>
        <Button text="Volver" color="bg-gray-600" onClick={() => navigate("/citas")} />
      </div>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">
        Seguimiento de cita #{id} – {cita.estudiante?.nombres} {cita.estudiante?.apellidos}
      </h2>

      {consultas.map((consulta) => (
        <div key={consulta.id} className="bg-white p-4 rounded shadow space-y-2">
          <p className="font-semibold">Motivo: {consulta.motivo}</p>

          <div>
            <h4 className="text-sm font-medium text-gray-600">Observaciones anteriores:</h4>
            <ul className="text-sm space-y-1">
              {observaciones[consulta.id]?.map((obs, i) => (
                <li key={i} className="border-l-4 border-blue-500 pl-2">
                  <p className="text-xs text-gray-500">{new Date(obs.fecha).toLocaleString()}</p>
                  <p>{obs.texto}</p>
                </li>
              ))}
            </ul>
          </div>

          {!mostrarCampoResumen && (
            <>
              <textarea
                rows={3}
                className="w-full border-b border-gray-400 focus:outline-none"
                placeholder="Escriba nueva observación..."
                value={textoNuevo[consulta.id] || ""}
                onChange={(e) => manejarCambioTexto(consulta.id, e.target.value)}
              />

              <ComboBox
                opciones={["en_progreso", "completado"]}
                valor={estadoConsulta[consulta.id] || ""}
                onChange={(valor) => cambiarEstado(consulta.id, valor)}
                label="Estado de la consulta"
              />
            </>
          )}
        </div>
      ))}

      {!mostrarCampoResumen && (
        <div className="flex gap-4 mt-6">
          <Button text="Volver" color="bg-gray-600" onClick={() => navigate("/citas")} />
          <Button text="Finalizar cita" color="bg-blue-600" onClick={finalizarCita} />
        </div>
      )}

      {mostrarCampoResumen && (
        <ResumenGeneral
          resumen={resumenGeneral}
          setResumen={setResumenGeneral}
          onGenerar={generarResumen}
          onGuardar={guardarResumen}
        />
      )}

      {notificacion && (
        <NotificacionFlotante
          mensaje={notificacion.mensaje}
          tipo={notificacion.tipo}
          onClose={() => setNotificacion(null)}
        />
      )}
    </main>
  );
};
