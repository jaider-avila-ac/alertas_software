import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ArrowLeft, CheckCircle2, MessageSquarePlus } from "lucide-react";
import { Button } from "../Button";
import { ResumenGeneral } from "../psico/ResumenGeneral";
import { Esqueleto } from "../Esqueleto";
import { ComboBox } from "../ComboBox";
import { NotificacionFlotante } from "../NotificacionFlotante";
import { UserContext } from "../../context/UserContext";
import {
  obtenerCitaPorId,
  cambiarEstadoCita,
} from "../../services/citaService";
import {
  obtenerSeguimientoPorId,
  obtenerSeguimientosCitaPorCita,
  generarResumenIA,
  guardarResumenGeneral,
} from "../../services/seguimientoService";
import {
  obtenerObservacionesPorSeguimiento,
  crearObservacion,
} from "../../services/observacionService";
import { cambiarEstadoConsulta } from "../../services/consultaService";

export const CitaActiva = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { usuario } = useContext(UserContext);

  const [cita,               setCita]               = useState(null);
  const [consultas,          setConsultas]          = useState([]);
  const [seguimientos,       setSeguimientos]       = useState({});
  const [observaciones,      setObservaciones]      = useState({});
  const [textoNuevo,         setTextoNuevo]         = useState({});
  const [estadoConsulta,     setEstadoConsulta]     = useState({});
  const [resumenGeneral,     setResumenGeneral]     = useState("");
  const [idSeguimientoGeneral, setIdSeguimientoGeneral] = useState(null);
  const [mostrarCampoResumen, setMostrarCampoResumen] = useState(false);
  const [cargando,           setCargando]           = useState(true);
  const [notificacion,       setNotificacion]       = useState(null);
  const [citaFinalizada,     setCitaFinalizada]     = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res      = await obtenerCitaPorId(id);
        const citaData = res.data;
        setCita(citaData);

        if (citaData.estado === "usada") {
          setCitaFinalizada(true);
          return;
        }

        const resSeguimientoCitas = await obtenerSeguimientosCitaPorCita(id);
        const seguimientoCitas    = resSeguimientoCitas.data || [];

        const seguimientosMap  = {};
        const observacionesMap = {};
        const consultasList    = [];
        let primerSeguimientoId = null;
        let primerResumen       = "";

        for (const sc of seguimientoCitas) {
          const resSeg    = await obtenerSeguimientoPorId(sc.seguimientoId);
          const seguimiento = resSeg.data;
          if (!seguimiento?.id || !seguimiento.consulta?.id) continue;

          const consulta = seguimiento.consulta;
          consultasList.push(consulta);
          seguimientosMap[consulta.id] = seguimiento.id;

          const resObs = await obtenerObservacionesPorSeguimiento(seguimiento.id);
          observacionesMap[consulta.id] = resObs.data || [];

          if (primerSeguimientoId === null) {
            primerSeguimientoId = seguimiento.id;
            primerResumen       = seguimiento.resumenGeneral || "";
          }
        }

        setConsultas(consultasList);
        setSeguimientos(seguimientosMap);
        setObservaciones(observacionesMap);
        if (primerSeguimientoId !== null) {
          setIdSeguimientoGeneral(primerSeguimientoId);
          setResumenGeneral(primerResumen);
        }
      } catch (err) {
        console.error("Error al cargar cita:", err);
        setNotificacion({ mensaje: "Error al cargar los datos de la cita.", tipo: "error" });
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [id]);

  const guardarObservacion = async (consultaId) => {
    const texto       = textoNuevo[consultaId];
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
      const estado     = estadoConsulta[idConsulta];
      const tieneObs   = observaciones[idConsulta]?.length > 0;
      const tieneTexto = textoNuevo[idConsulta]?.trim();

      if (!estado || (!tieneObs && !tieneTexto)) {
        setNotificacion({ mensaje: "Cada consulta debe tener observación y estado.", tipo: "error" });
        return;
      }

      if (tieneTexto) await guardarObservacion(idConsulta);
      await cambiarEstadoConsulta(idConsulta, estado);
    }

    await cambiarEstadoCita(id, "usada");
    setMostrarCampoResumen(true);
  };

  const generarResumen = async () => {
    try {
      const res = await generarResumenIA(idSeguimientoGeneral);
      return res.data;
    } catch {
      return "ERROR_INTERNO";
    }
  };

  const guardarResumen = async () => {
    await guardarResumenGeneral(idSeguimientoGeneral, resumenGeneral);
    navigate("/citas", { replace: true });
  };

  /* ── Loading ── */
  if (cargando) {
    return (
      <main className="space-y-4">
        <Esqueleto className="h-8 w-2/3 rounded" />
        <Esqueleto className="h-44 w-full rounded-xl" />
        <Esqueleto className="h-44 w-full rounded-xl" />
      </main>
    );
  }

  /* ── Cita ya finalizada ── */
  if (citaFinalizada) {
    return (
      <main className="flex flex-col items-center justify-center gap-4 py-20">
        <CheckCircle2 size={56} className="text-emerald-400" />
        <h2 className="text-xl font-semibold text-gray-700">Esta cita ya fue finalizada.</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 transition-colors"
        >
          <ArrowLeft size={16} /> Volver a citas
        </button>
      </main>
    );
  }

  const estudiante = cita?.estudiante;

  return (
    <main className="space-y-5">

      {/* Encabezado */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Volver
        </button>
        <div>
          <h2 className="text-2xl font-bold leading-tight">
            Cita #{id}
          </h2>
          {estudiante && (
            <p className="text-sm text-gray-500">
              {estudiante.nombres} {estudiante.apellidos}
              {estudiante.curso ? ` · ${estudiante.curso}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Consultas */}
      {consultas.map((consulta) => (
        <div
          key={consulta.id}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="border-l-4 border-pink-500 px-5 py-4 space-y-4">

            {/* Motivo */}
            <p className="font-semibold text-gray-800">
              Motivo: <span className="font-normal text-gray-600">{consulta.motivo}</span>
            </p>

            {/* Observaciones anteriores */}
            {observaciones[consulta.id]?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Observaciones anteriores
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {observaciones[consulta.id].map((obs, i) => (
                    <div key={i} className="border-l-4 border-pink-300 pl-3 py-1">
                      <p className="text-xs text-gray-400 mb-0.5">
                        {new Date(obs.fecha).toLocaleString("es-CO")}
                      </p>
                      <p className="text-sm text-gray-700">{obs.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nueva observación y estado */}
            {!mostrarCampoResumen && (
              <div className="space-y-3 pt-1">
                <div className="relative">
                  <MessageSquarePlus
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <textarea
                    rows={3}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 resize-none"
                    placeholder="Escribir nueva observación..."
                    value={textoNuevo[consulta.id] || ""}
                    onChange={(e) =>
                      setTextoNuevo((prev) => ({ ...prev, [consulta.id]: e.target.value }))
                    }
                  />
                </div>

                <ComboBox
                  opciones={["en_progreso", "completado"]}
                  valor={estadoConsulta[consulta.id] || ""}
                  onChange={(valor) =>
                    setEstadoConsulta((prev) => ({ ...prev, [consulta.id]: valor }))
                  }
                  label="Estado de la consulta"
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Acciones principales */}
      {!mostrarCampoResumen && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={15} /> Volver
          </button>
          <button
            onClick={finalizarCita}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition-colors"
          >
            <CheckCircle2 size={15} /> Finalizar cita
          </button>
        </div>
      )}

      {/* Resumen IA */}
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
