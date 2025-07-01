import { useContext, useEffect, useState } from "react";
import { Layout } from "../layout/Layout";
import { Card } from "../components/Card";
import { CalendarDays, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Esqueleto } from "../components/Esqueleto";
import { UserContext } from "../context/UserContext";
import { obtenerResumenDashboard } from "../services/dashboardService";
import { obtenerCitasPorEstudiante } from "../services/citaService";

export const DashboardEstudiante = () => {
  const { usuario } = useContext(UserContext);
  const estudianteId = usuario?.id;

  const [resumen, setResumen] = useState({
    alertasDelEstudiante: 0,
    citasPendientesEstudiante: 0,
    consultasCompletadasEstudiante: 0,
  });

  const [citasProgramadas, setCitasProgramadas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Obtener datos resumen desde el nuevo endpoint
        const resResumen = await obtenerResumenDashboard(usuario.rol, estudianteId);
        setResumen(resResumen.data);

        // Cargar citas programadas con estado "pendiente"
        const resCitas = await obtenerCitasPorEstudiante(estudianteId);
        const citas = resCitas.data || [];
        const programadas = citas.filter(c => c.estado === "pendiente");
        setCitasProgramadas(programadas);
      } catch (error) {
        console.error("Error al cargar el dashboard del estudiante:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [estudianteId, usuario.rol]);

  return (
    <Layout>
      <main className="space-y-6">
        <h2 className="text-2xl font-bold">Mi Panel</h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Card
              label="Mis Alertas"
              total={resumen.alertasDelEstudiante}
              icon={AlertTriangle}
              bgColor="bg-amber-400"
            />
          </div>
          <div>
            <Card
              label="Citas Pendientes"
              total={resumen.citasPendientesEstudiante}
              icon={CalendarDays}
              bgColor="bg-blue-500"
            />
          </div>
          <div>
            <Card
              label="Consultas Completadas"
              total={resumen.consultasCompletadasEstudiante}
              icon={CheckCircle2}
              bgColor="bg-green-500"
            />
          </div>
        </div>

        <section>
          <h3 className="text-xl font-semibold mb-2">Citas Programadas</h3>
          {cargando ? (
            <Esqueleto className="h-20 w-full" />
          ) : citasProgramadas.length > 0 ? (
            <div className="space-y-3">
              {citasProgramadas.map((cita) => (
                <div
                  key={cita.id}
                  className="bg-white shadow p-4 rounded border-l-4 border-pink-500"
                >
                  <p className="text-lg font-medium text-gray-800">
                    Fecha: {new Date(cita.fecha).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Psicorientador: {cita.psicorientador?.nombres || "No asignado"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-600">No tienes citas programadas.</p>
          )}
        </section>
      </main>
    </Layout>
  );
};
