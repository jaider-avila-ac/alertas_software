import { useState } from "react";
import { Button } from "../Button";
import { NotificacionFlotante } from "../NotificacionFlotante";

export const ResumenGeneral = ({ resumen, setResumen, onGenerar, onGuardar }) => {
  const [notificacion, setNotificacion] = useState(null);

  const manejarGenerar = async () => {
    try {
      const resultado = await onGenerar();

      if (resultado === "NO_OBSERVACIONES") {
        setNotificacion({
          mensaje: "No hay observaciones válidas para generar el resumen.",
          tipo: "error",
        });
      } else if (resultado === "YA_GENERADO_PARA_ESTAS_OBSERVACIONES") {
        setNotificacion({
          mensaje: "El resumen ya fue generado para estas observaciones.",
          tipo: "info",
        });
      } else if (resultado === "RESUMEN_YA_GENERADO") {
        setNotificacion({
          mensaje: "El resumen ya fue generado anteriormente y no ha cambiado.",
          tipo: "info",
        });
      } else {
        setResumen(resultado);
        setNotificacion({
          mensaje: "Resumen generado automáticamente.",
          tipo: "exito",
        });
      }
    } catch (error) {
      console.error("Error al generar resumen:", error);
      setNotificacion({
        mensaje: "Error inesperado al generar el resumen.",
        tipo: "error",
      });
    }
  };

  const manejarGuardar = async () => {
    try {
      await onGuardar(); // se asume que lanza error si falla
      setNotificacion({
        mensaje: "Resumen guardado correctamente.",
        tipo: "exito",
      });
    } catch (error) {
      console.error("Error al guardar resumen:", error);
      setNotificacion({
        mensaje: "Error al guardar el resumen.",
        tipo: "error",
      });
    }
  };

  return (
    <div className="mt-6 p-4 bg-white shadow rounded space-y-2">
      <h3 className="font-bold text-lg">Resumen General del Seguimiento</h3>

      <textarea
        rows={5}
        className="w-full border p-2"
        value={resumen}
        onChange={(e) => setResumen(e.target.value)}
        placeholder="Escriba o edite el resumen general..."
      />

      <div className="flex gap-4">
        <Button
          text="Generar automáticamente"
          color="bg-emerald-600"
          onClick={manejarGenerar}
        />
        <Button
          text="Guardar"
          color="bg-blue-700"
          onClick={manejarGuardar}
        />
      </div>

      {notificacion && (
        <NotificacionFlotante
          mensaje={notificacion.mensaje}
          tipo={notificacion.tipo}
          onClose={() => setNotificacion(null)}
        />
      )}
    </div>
  );
};
