import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { CitaCard } from "../components/psico/CitaCard";
import { CalendarDays, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Esqueleto } from "../components/Esqueleto";
import { UserContext } from "../context/UserContext";
import { obtenerResumenDashboard } from "../services/dashboardService";
import { obtenerCitasPorEstudiante } from "../services/citaService";
import useWebSocket from "../services/useWebSocket";

let _cacheResumen = null;
let _cacheCitas   = null;
let _cacheKey     = null;

export const DashboardEstudiante = () => {
  const { usuario }    = useContext(UserContext);
  const navigate       = useNavigate();
  const estudianteId   = usuario?.id;
  const key            = String(estudianteId);

  const cacheValid = _cacheKey === key;

  const [resumen, setResumen] = useState(
    cacheValid && _cacheResumen
      ? _cacheResumen
      : { alertasDelEstudiante: 0, citasPendientesEstudiante: 0, consultasCompletadasEstudiante: 0 }
  );
  const [citasProgramadas, setCitasProgramadas] = useState(cacheValid && _cacheCitas ? _cacheCitas : []);
  const [cargando, setCargando]                 = useState(!cacheValid);
  const [version, setVersion]                   = useState(0);

  // WebSocket: actualiza al recibir nueva alerta o cita
  useWebSocket(
    estudianteId
      ? [`/topic/consultas/${estudianteId}`, `/topic/citas/${estudianteId}`]
      : [],
    () => {
      _cacheResumen = null;
      _cacheCitas   = null;
      _cacheKey     = null;
      setVersion((v) => v + 1);
    }
  );

  useEffect(() => {
    if (!estudianteId) return;
    let active = true;

    const cargar = async () => {
      try {
        const [resRes, resCitas] = await Promise.all([
          obtenerResumenDashboard(usuario.rol, estudianteId),
          obtenerCitasPorEstudiante(estudianteId),
        ]);

        if (!active) return;

        const resumenData   = resRes.data;
        const programadas   = (resCitas.data || []).filter((c) => c.estado === "pendiente");

        _cacheResumen = resumenData;
        _cacheCitas   = programadas;
        _cacheKey     = key;

        setResumen(resumenData);
        setCitasProgramadas(programadas);
      } catch (error) {
        console.error("Error al cargar dashboard del estudiante:", error);
      } finally {
        if (active) setCargando(false);
      }
    };

    cargar();
    return () => { active = false; };
  }, [estudianteId, version]);

  return (
    <main className="space-y-6">
      <h2 className="text-2xl font-bold">Mi Panel</h2>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cargando ? (
          <>
            <Esqueleto className="h-20 w-full rounded-xl" />
            <Esqueleto className="h-20 w-full rounded-xl" />
            <Esqueleto className="h-20 w-full rounded-xl" />
          </>
        ) : (
          <>
            <Card
              label="Mis Alertas"
              total={resumen.alertasDelEstudiante}
              icon={AlertTriangle}
              bgColor="bg-amber-400"
              onClick={() => navigate("/mis-alertas")}
            />
            <Card
              label="Citas Pendientes"
              total={resumen.citasPendientesEstudiante}
              icon={CalendarDays}
              bgColor="bg-blue-500"
              onClick={() => navigate("/citas")}
            />
            <Card
              label="Completadas"
              total={resumen.consultasCompletadasEstudiante}
              icon={CheckCircle2}
              bgColor="bg-green-500"
              onClick={() => navigate("/mis-alertas")}
            />
          </>
        )}
      </div>

      {/* Citas programadas */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Citas Programadas</h3>

        {cargando ? (
          <div className="space-y-3">
            <Esqueleto className="h-16 w-full rounded-xl" />
            <Esqueleto className="h-16 w-full rounded-xl" />
          </div>
        ) : citasProgramadas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 bg-white rounded-xl border border-gray-100 text-gray-400">
            <CalendarDays size={36} className="mb-2 opacity-30" />
            <p className="text-sm">No tienes citas programadas.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {citasProgramadas.map((cita) => (
              <CitaCard
                key={cita.id}
                cita={cita}
                mostrarPsico
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
