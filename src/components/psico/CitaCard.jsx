import { CalendarDays, BookOpen, Brain, Play, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ESTADO = {
  pendiente:   { label: "Pendiente",   bg: "bg-amber-400"   },
  usada:       { label: "Completada",  bg: "bg-emerald-500" },
  cancelada:   { label: "Cancelada",   bg: "bg-red-500"     },
  en_progreso: { label: "En progreso", bg: "bg-blue-500"    },
};

export const CitaCard = ({ cita, onCancelar, mostrarPsico = false, esAdmin = false }) => {
  const navigate = useNavigate();

  const {
    id,
    fecha,
    estudiante: { nombres, apellidos, curso } = {},
    psicorientador,
    estado,
  } = cita;

  const cfg            = ESTADO[estado] ?? { label: estado, bg: "bg-gray-400" };
  const nombreCompleto = `${nombres ?? ""} ${apellidos ?? ""}`.trim();
  const fechaFormateada = new Date(fecha).toLocaleDateString("es-CO");

  const puedeIniciar = estado === "pendiente" && (onCancelar || esAdmin);

  return (
    <div className="flex flex-col sm:flex-row bg-white mb-3 items-start sm:items-center p-2 rounded shadow-sm gap-3 max-w-full hover:shadow-md transition">

      {/* Caja de color con ícono — igual que AlertaCard */}
      <div className={`w-14 h-14 hidden lg:flex items-center justify-center flex-shrink-0 rounded ${cfg.bg}`}>
        <CalendarDays size={22} className="text-white" />
      </div>

      {/* Info central */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="hidden lg:flex bg-pink-500 w-24 h-6 items-center justify-center rounded text-white font-semibold text-sm shrink-0">
            Cita #{id}
          </div>
          <p className="font-semibold text-sm truncate">{nombreCompleto}</p>
        </div>

        <div className="flex gap-3 flex-wrap text-xs items-center">
          <span className="flex items-center gap-1 whitespace-nowrap text-gray-600">
            <CalendarDays size={12} /> {fechaFormateada}
          </span>
          {curso && (
            <span className="flex items-center gap-1 whitespace-nowrap text-gray-600">
              <BookOpen size={12} /> {curso}
            </span>
          )}
          {mostrarPsico && psicorientador?.nombres && (
            <span className="flex items-center gap-1 whitespace-nowrap text-gray-600">
              <Brain size={12} /> {psicorientador.nombres}
            </span>
          )}
          <span className={`px-2 py-0.5 rounded text-white font-semibold ${cfg.bg}`}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Acciones — a la derecha igual que AlertaCard */}
      {puedeIniciar && (
        <div
          className="flex flex-row gap-2 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => navigate(`/citas/activa/${id}`)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-500 text-white text-xs font-semibold hover:bg-pink-600 transition-colors"
          >
            <Play size={12} /> Iniciar
          </button>
          {onCancelar && !esAdmin && (
            <button
              onClick={() => onCancelar(id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <X size={12} /> Cancelar
            </button>
          )}
        </div>
      )}
    </div>
  );
};
