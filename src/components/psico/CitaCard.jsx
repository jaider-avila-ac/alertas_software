import { CalendarDays, User, AlertCircle, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button";

export const CitaCard = ({ cita, onCancelar, mostrarPsico = false, esAdmin = false }) => {
  const navigate = useNavigate();

  const {
    id,
    fecha,
    estudiante: { nombres, apellidos, curso } = {},
    psicorientador,
    consultas = [],
    estado,
  } = cita;

  const nombreCompleto = `${nombres} ${apellidos}`;
  const fechaFormateada = new Date(fecha).toLocaleDateString("es-CO");

  const iniciarCita = () => {
    navigate(`/citas/activa/${id}`);
  };

  return (
    <div className="bg-white rounded shadow p-4 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Cita #{id}</h3>
        <span className="text-sm text-gray-600">{fechaFormateada}</span>
      </div>

      <div className="text-sm text-gray-700 space-y-1">
        <p className="flex items-center gap-1">
          <User size={14} /> <strong>Estudiante:</strong> {nombreCompleto}
        </p>
        <p className="flex items-center gap-1">
          <AlertCircle size={14} /> <strong>Curso:</strong> {curso || "N/D"}
        </p>
        <p className="flex items-center gap-1">
          <CalendarDays size={14} /> <strong>Alertas asociadas:</strong> {consultas.length}
        </p>
        <p className="text-xs text-gray-500">
          <strong>Estado:</strong> {estado}
        </p>

        {mostrarPsico && psicorientador?.nombres && (
          <p className="flex items-center gap-1 text-sm text-gray-600">
            <Brain size={14} /> <strong>Psicorientador:</strong> {psicorientador.nombres}
          </p>
        )}
      </div>

     {estado === "pendiente" && onCancelar && !esAdmin && (
  <div className="flex gap-2 pt-2">
    <Button text="Iniciar" color="bg-blue-600" onClick={iniciarCita} />
    <Button text="Cancelar" color="bg-red-600" onClick={() => onCancelar(id)} />
  </div>
)}
    </div>
  );
};
