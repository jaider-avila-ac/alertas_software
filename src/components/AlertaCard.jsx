import { useContext, useState } from "react";
import { Pin, Calendar, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { UserContext } from "../context/UserContext";
import { eliminarConsulta } from "../services/consultaService";
import { alertaVisual } from "../utils/alertaVisual";
import { ModalBase } from "./ModalBase";

export const AlertaCard = ({ alerta, onEliminar }) => {
  const { id, nombreEstudiante, motivo, fecha, estado, nivel, icono, color } = alerta;
  const navigate = useNavigate();
  const { usuario } = useContext(UserContext);
  const [mostrarModal, setMostrarModal] = useState(false);

  const irASeguimientos = () => {
    const nombreEncoded = encodeURIComponent(nombreEstudiante);
    navigate(`/seguimientos/${id}?estudiante=${nombreEncoded}`);
  };

  const editarAlerta = (e) => {
    e.stopPropagation();
    navigate(`/editar-alerta/${id}`);
  };

  const confirmarEliminacion = async () => {
    try {
      await eliminarConsulta(id);
      setMostrarModal(false);
      if (onEliminar) {
        onEliminar();
      } else {
        window.location.reload();
      }
      alertaVisual("Alerta eliminada con éxito", "success");
    } catch (error) {
      console.error("Error eliminando alerta:", error);
      alertaVisual("No se pudo eliminar la alerta", "error");
    }
  };

  const puedeEditarOEliminar =
    estado?.toLowerCase() === "pendiente" && usuario?.rol === 0;

  return (
    <>
      <div
        onClick={irASeguimientos}
        className="flex flex-col sm:flex-row bg-white mb-3 items-start sm:items-center p-2 rounded shadow-sm gap-3 max-w-full cursor-pointer hover:shadow-md transition"
      >
        <div className={`w-14 h-14 hidden lg:flex items-center justify-center flex-shrink-0 rounded ${color}`}>
          <img loading="lazy" src={icono} alt="icono alerta" className="w-6 h-6 object-contain" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="hidden lg:flex bg-blue-600 w-24 h-6 items-center justify-center rounded text-white font-semibold text-sm">
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

        {puedeEditarOEliminar && (
          <div
            className="flex flex-row justify-center gap-2 mt-3 lg:flex-col lg:items-end lg:ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              icon={Edit}
              color="bg-yellow-500"
              title="Editar alerta"
              onClick={editarAlerta}
              text=""
            />
            <Button
              icon={Trash2}
              color="bg-red-600"
              title="Eliminar alerta"
              onClick={() => setMostrarModal(true)}
              text=""
            />
          </div>
        )}
      </div>

      <ModalBase visible={mostrarModal} onClose={() => setMostrarModal(false)}>
        <h2 className="text-lg font-bold mb-4 text-center text-gray-800">¿Eliminar alerta?</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            text="Cancelar"
            color="bg-gray-400"
            onClick={() => setMostrarModal(false)}
          />
          <Button
            text="Eliminar"
            color="bg-red-600"
            onClick={confirmarEliminacion}
          />
        </div>
      </ModalBase>
    </>
  );
};
