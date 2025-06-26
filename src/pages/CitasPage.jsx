import { useEffect, useState } from "react";
import { obtenerCitas, cancelarCita as cancelarCitaService } from "../services/citaService";
import { Layout } from "../layout/Layout";
import { CitaCard } from "../components/psico/CitaCard";

export const CitasPage = () => {
  const [citas, setCitas] = useState([]);

  const cargarCitas = async () => {
    try {
      const res = await obtenerCitas();
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
    cargarCitas();
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Citas Agendadas</h1>
        {citas.length === 0 ? (
          <p>No hay citas disponibles.</p>
        ) : (
          citas.map((cita) => (
            <CitaCard
              key={cita.id}
              cita={cita}
              onCancelar={() => manejarCancelacion(cita.id)}
            />
          ))
        )}
      </div>
    </Layout>
  );
};
