import { useState, useEffect } from "react";
import { Button } from "../Button";
import { Notificacion } from "../Notificacion";
import { CheckCircle } from "lucide-react";

export const ModalAgendarCita = ({ visible, onClose, onConfirm }) => {
  const [fecha, setFecha] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    if (visible) {
      setTimeout(() => setMostrar(true), 10);
    } else {
      setMostrar(false);
      setFecha("");
      setExito(false);
    }
  }, [visible]);

  const manejarConfirmacion = async () => {
    try {
      await onConfirm(fecha);
      setExito(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2500);
    } catch (error) {
      console.error("Error al agendar cita:", error);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="absolute inset-0 bg-transparent pointer-events-none" />
      <div
        className={`bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transition-all duration-300 transform ${
          mostrar ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          Agendar nueva cita
        </h2>

        {exito && (
          <Notificacion
            texto="Cita agendada exitosamente"
            color="bg-green-500"
            icono={CheckCircle}
          />
        )}

        {!exito && (
          <>
            <label className="block mb-2 text-sm text-gray-600">
              Fecha de la cita:
            </label>
            <input
              type="date"
              className="w-full border-b-2 border-gray-300 focus:border-pink-500 outline-none px-2 py-2 mb-6 transition-all"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <Button
                text="Cancelar"
                color="bg-gray-400"
                onClick={onClose}
                title="Cerrar sin guardar"
              />
              <Button
                text="Confirmar"
                color="bg-pink-600"
                onClick={manejarConfirmacion}
                title="Agendar cita"
                disabled={!fecha}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
