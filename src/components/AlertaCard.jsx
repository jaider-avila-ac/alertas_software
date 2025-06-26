import { Pin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AlertaCard = ({ alerta }) => {
  const { id, nombreEstudiante, motivo, fecha, estado, nivel, icono, color } = alerta;
  const navigate = useNavigate();

  const irASeguimientos = () => {
    const nombreEncoded = encodeURIComponent(nombreEstudiante);
    navigate(`/seguimientos/${id}?estudiante=${nombreEncoded}`);
  };

  return (
    <div
      onClick={irASeguimientos}
      className="flex flex-col sm:flex-row bg-white mb-3 items-start sm:items-center p-2 rounded shadow-sm gap-3 max-w-full cursor-pointer hover:shadow-md transition"
    >
      <div className={`w-14 h-14 flex items-center justify-center flex-shrink-0 rounded ${color}`}>
        <img loading="lazy" src={icono} alt="icono alerta" className="w-6 h-6 object-contain" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-blue-600 w-24 h-6 flex items-center justify-center rounded text-white font-semibold text-sm">
            <p className="m-0">{id}</p>
          </div>
          <p className="font-semibold text-sm truncate">{nombreEstudiante}</p>
        </div>

        <div className="flex gap-3 flex-wrap text-xs items-center">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <Pin size={12} /> <span>{motivo}</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <Calendar size={12} /> <span>{fecha}</span>
          </div>
          <div className={`px-2 py-0.5 rounded text-white font-semibold ${color}`}>
            <div className="flex items-center gap-1">
              <img loading="lazy" src={icono} alt={nivel} className="w-3 h-3" />
              <p className="m-0 capitalize">{nivel}</p>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded text-white font-semibold bg-gray-500">
            <p className="m-0 capitalize">{estado}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
