import { useState, useContext } from "react";
import { Button } from "../Button";
import { NotificacionFlotante } from "../NotificacionFlotante";
import { UserContext } from "../../context/UserContext";
import { Sparkles, Save } from "lucide-react"; // Ejemplo de íconos

export const ResumenGeneral = ({ resumen, setResumen, onGenerar, onGuardar }) => {
  const [notificacion, setNotificacion] = useState(null);
  const { usuario } = useContext(UserContext);
  const esPsico = usuario?.rol === 2; // ajusta según tu sistema (2 = psicorientador)

  const manejarGenerar = async () => {
    try {
      const resultado = await onGenerar();

      if (resultado === "NO_OBSERVACIONES") {
        setNotificacion({ mensaje: "No hay observaciones válidas para generar el resumen.", tipo: "error" });
      } else if (resultado === "YA_GENERADO_PARA_ESTAS_OBSERVACIONES") {
        setNotificacion({ mensaje: "El resumen ya fue generado para estas observaciones.", tipo: "info" });
      } else if (resultado === "RESUMEN_YA_GENERADO") {
        setNotificacion({ mensaje: "El resumen ya fue generado anteriormente y no ha cambiado.", tipo: "info" });
      } else {
        setResumen(resultado);
        setNotificacion({ mensaje: "Resumen generado automáticamente.", tipo: "exito" });
      }
    } catch (error) {
      console.error("Error al generar resumen:", error);
      setNotificacion({ mensaje: "Error inesperado al generar el resumen.", tipo: "error" });
    }
  };

  const manejarGuardar = async () => {
    try {
      await onGuardar();
      setNotificacion({ mensaje: "Resumen guardado correctamente.", tipo: "exito" });
    } catch (error) {
      console.error("Error al guardar resumen:", error);
      setNotificacion({ mensaje: "Error al guardar el resumen.", tipo: "error" });
    }
  };

  return (
    <div className="mt-6 p-4 bg-white shadow rounded space-y-2">
      <h3 className="font-bold text-lg">Resumen General del Seguimiento</h3>

      {esPsico ? (
        <textarea
          rows={5}
          className="w-full border p-2"
          value={resumen}
          onChange={(e) => setResumen(e.target.value)}
          placeholder="Escriba o edite el resumen general..."
        />
      ) : (
        <div className="min-h-[120px] p-2 border bg-gray-50 text-gray-700 rounded">
          {resumen?.trim() ? resumen : <em className="text-gray-400">Sin observación general.</em>}
        </div>
      )}

      {esPsico && (
        <div className="flex gap-4">
          <Button
            icon={Sparkles}
            color="bg-emerald-600"
            onClick={manejarGenerar}
            title="Generar automáticamente"
          />
          <Button
            icon={Save}
            color="bg-blue-700"
            onClick={manejarGuardar}
            title="Guardar"
          />
        </div>
      )}

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
