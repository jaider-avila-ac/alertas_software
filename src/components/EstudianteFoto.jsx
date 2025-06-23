import { useEffect, useState } from "react";
import MarcoBorde from "../assets/fotos_estudiante/marco_borde.png";
import FotoPorDefecto from "../assets/fotos_estudiante/CARD_PERFIL.jpg";
import { obtenerImagenEstudiante } from "../services/estudianteService";

export const EstudianteFoto = ({ estudiante }) => {
  const [imagenUrl, setImagenUrl] = useState(FotoPorDefecto);

  useEffect(() => {
    if (estudiante?.id) {
      obtenerImagenEstudiante(estudiante.id)
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          setImagenUrl(url);
        })
        .catch(() => {
          setImagenUrl(FotoPorDefecto);
        });
    }
  }, [estudiante]);

  return (
    <div className="border p-4 rounded text-center">
      <div className="relative w-full max-w-[160px] aspect-[3/4] mx-auto mb-3">
        {/* Marco PNG sobre la imagen */}
        <img
          src={MarcoBorde}
          alt="Marco"
          className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
        />
        {/* Imagen del estudiante */}
        <img
          src={imagenUrl}
          alt="Foto estudiante"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      </div>

      {estudiante ? (
        <>
          <p className="text-sm font-semibold">{estudiante.nombres} {estudiante.apellidos}</p>
          <p className="text-xs text-gray-600">{estudiante.nroDoc}</p>
          <p className="text-xs text-gray-600">Curso: {estudiante.curso || "No definido"}</p>
        </>
      ) : (
        <p className="text-gray-500 text-sm">Estudiante no identificado</p>
      )}
    </div>
  );
};
