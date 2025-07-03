import { useContext, useEffect, useState } from "react";
import { CitaCard } from "../components/psico/CitaCard";
import { UserContext } from "../context/UserContext";
import {
  obtenerCitas,
  obtenerCitasPorPsico,
  obtenerCitasPorEstudiante,
  cancelarCita as cancelarCitaService,
} from "../services/citaService";


export const CitasPage = () => {
  const [citas, setCitas] = useState([]);
  const { usuario } = useContext(UserContext);

  const cargarCitas = async () => {
    try {
      let res;
      if (usuario.rol === 1) {
        res = await obtenerCitasPorEstudiante(usuario.id);
      } else if (usuario.rol === 3) {
        res = await obtenerCitas();
      } else {
        res = await obtenerCitasPorPsico(usuario.id);
      }
      setCitas(res.data || []);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    }
  };

  const manejarCancelacion = async (id) => {
    try {
      await cancelarCitaService(id);
      cargarCitas();
    } catch (error) {
      console.error("Error al cancelar cita:", error);
    }
  };
  useEffect(() => {
    if (usuario?.id && usuario?.rol !== null) {
      cargarCitas();
    }
  }, [usuario]);

  return (

    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        {usuario.rol === 1 ? "Mis Citas" : "Citas Agendadas"}
      </h1>
      {citas.length === 0 ? (
        <p className="italic text-gray-600">No hay citas registradas.</p>
      ) : (
        citas.map((cita) => (
          <CitaCard
            key={cita.id}
            cita={cita}
            onCancelar={
              usuario.rol !== 1 && usuario.rol !== 3
                ? () => manejarCancelacion(cita.id)
                : undefined
            }
            mostrarPsico={usuario.rol === 1}
            esAdmin={usuario.rol === 3}
          />))
      )}
    </div>

  );
};
