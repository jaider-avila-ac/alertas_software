import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CitaCard } from "../components/psico/CitaCard";
import { UserContext } from "../context/UserContext";
import { Esqueleto } from "../components/Esqueleto";
import { CalendarDays, ArrowLeft } from "lucide-react";
import {
  obtenerCitas,
  obtenerCitasPorPsico,
  obtenerCitasPorEstudiante,
  cancelarCita as cancelarCitaService,
} from "../services/citaService";
import useWebSocket from "../services/useWebSocket";

let _cache = null;
let _cacheKey = null;

export const CitasPage = () => {
  const { usuario } = useContext(UserContext);
  const navigate    = useNavigate();
  const cacheKey    = `${usuario?.id}-${usuario?.rol}`;

  const [citas,    setCitas]    = useState(_cacheKey === cacheKey ? (_cache ?? []) : []);
  const [cargando, setCargando] = useState(_cacheKey !== cacheKey || !_cache);
  const [version,  setVersion]  = useState(0);

  // WebSocket solo para estudiantes (rol=1): actualiza citas en tiempo real
  useWebSocket(
    usuario?.rol === 1 && usuario?.id
      ? [`/topic/citas/${usuario.id}`]
      : [],
    () => {
      _cache    = null;
      _cacheKey = null;
      setVersion((v) => v + 1);
    }
  );

  const fetchCitas = async () => {
    try {
      let res;
      if (usuario.rol === 1)      res = await obtenerCitasPorEstudiante(usuario.id);
      else if (usuario.rol === 3) res = await obtenerCitas();
      else                        res = await obtenerCitasPorPsico(usuario.id);

      const datos = res.data || [];
      _cache    = datos;
      _cacheKey = cacheKey;
      setCitas(datos);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    }
  };

  useEffect(() => {
    if (!usuario?.id && usuario?.rol === null) return;
    let active = true;

    fetchCitas().finally(() => { if (active) setCargando(false); });

    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id, usuario?.rol, version]);

  const manejarCancelacion = async (id) => {
    try {
      await cancelarCitaService(id);
      _cache = null;
      await fetchCitas();
    } catch (error) {
      console.error("Error al cancelar cita:", error);
    }
  };

  return (
    <main className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Volver
        </button>
        <h1 className="text-2xl font-bold">
          {usuario.rol === 1 ? "Mis Citas" : "Citas Agendadas"}
        </h1>
      </div>

      {cargando ? (
        <div className="space-y-3">
          {Array(3).fill(0).map((_, i) => (
            <Esqueleto key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : citas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100 text-gray-400">
          <CalendarDays size={44} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">No hay citas registradas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {citas.map((cita) => (
            <CitaCard
              key={cita.id}
              cita={cita}
              onCancelar={
                usuario.rol !== 1 && usuario.rol !== 3
                  ? () => manejarCancelacion(cita.id)
                  : undefined
              }
              mostrarPsico={usuario.rol === 1}
              esAdmin={usuario.rol === 3}
            />
          ))}
        </div>
      )}
    </main>
  );
};
