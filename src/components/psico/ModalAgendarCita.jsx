import { useState, useEffect } from "react";
import { CalendarDays, CheckCircle2, X } from "lucide-react";

export const ModalAgendarCita = ({ visible, onClose, onConfirm }) => {
  const [fecha,   setFecha]   = useState("");
  const [exito,   setExito]   = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!visible) {
      setFecha("");
      setExito(false);
      setCargando(false);
      setError("");
    }
  }, [visible]);

  const manejarConfirmacion = async () => {
    if (!fecha) return;
    setCargando(true);
    setError("");
    try {
      await onConfirm(fecha);
      setExito(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    } catch {
      setError("No se pudo agendar la cita. Intenta de nuevo.");
      setCargando(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Tarjeta */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Ícono header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mb-4">
            <CalendarDays size={28} className="text-pink-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 text-center">
            Agendar cita
          </h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            Selecciona la fecha para la nueva cita
          </p>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {exito ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 size={44} className="text-emerald-500" />
              <p className="text-sm font-semibold text-emerald-700 text-center">
                ¡Cita agendada exitosamente!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Fecha de la cita
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={manejarConfirmacion}
                  disabled={!fecha || cargando}
                  className="flex-1 py-2.5 rounded-lg bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cargando ? "Guardando..." : "Confirmar"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
