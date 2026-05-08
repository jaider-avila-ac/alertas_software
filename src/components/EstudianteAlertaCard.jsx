import { useEffect, useState } from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import FotoPorDefecto from "../assets/fotos_estudiante/CARD_PERFIL.jpg";
import { obtenerImagenEstudiante } from "../services/estudianteService";

export const EstudianteAlertaCard = ({ grupo, onClick }) => {
  const { estudianteId, nombreEstudiante, total, pendientes } = grupo;
  const [imagenUrl, setImagenUrl] = useState(FotoPorDefecto);

  useEffect(() => {
    if (estudianteId) {
      obtenerImagenEstudiante(estudianteId)
        .then((res) => {
          if (res?.data && res.data.size > 0) {
            setImagenUrl(URL.createObjectURL(res.data));
          }
        })
        .catch(() => {});
    }
  }, [estudianteId]);

  return (
    <div
      onClick={onClick}
      className="flex flex-col sm:flex-row bg-white mb-3 items-start sm:items-center p-2 rounded shadow-sm gap-3 max-w-full cursor-pointer hover:shadow-md transition"
    >
      {/* Foto estudiante */}
      <div className="w-14 h-14 hidden lg:flex items-center justify-center flex-shrink-0 rounded overflow-hidden border border-gray-200">
        <img
          loading="lazy"
          src={imagenUrl}
          alt={nombreEstudiante}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate mb-1">{nombreEstudiante}</p>

        <div className="flex gap-2 flex-wrap text-xs items-center">
          <div className="px-2 py-0.5 rounded text-white font-semibold bg-pink-500">
            <p className="m-0">{total} alerta{total !== 1 ? "s" : ""}</p>
          </div>

          {pendientes > 0 ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded text-white font-semibold bg-amber-400">
              <AlertTriangle size={10} />
              <p className="m-0">{pendientes} pendiente{pendientes !== 1 ? "s" : ""}</p>
            </div>
          ) : (
            <div className="px-2 py-0.5 rounded text-white font-semibold bg-emerald-500">
              <p className="m-0">Sin pendientes</p>
            </div>
          )}
        </div>
      </div>

      {/* Indicador de navegación */}
      <div className="hidden lg:flex items-center text-gray-300 flex-shrink-0">
        <ChevronRight size={20} />
      </div>
    </div>
  );
};
