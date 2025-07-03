import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../layout/Layout";
import { Card } from "../components/Card";
import { Esqueleto } from "../components/Esqueleto";
import { CalendarClock, FileText, Users } from "lucide-react";

import { UserContext } from "../context/UserContext";
import { ListadoEstudiantesPendientes } from "../components/psico/ListadoEstudiantesPendientes";
import { obtenerResumenDashboard } from "../services/dashboardService";

export const DashboardPsicorientador = () => {
  const [resumen, setResumen] = useState({
    alertasPendientesPsico: 0,
    alertasCompletadasPsico: 0,
    citasAsignadasPsico: 0,
  });
  const [cargando, setCargando] = useState(true);
  const { usuario } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarResumen = async () => {
      try {
        const res = await obtenerResumenDashboard(usuario.rol, usuario.id);
        setResumen(res.data);
      } catch (error) {
        console.error("Error cargando resumen del psicorientador:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarResumen();
  }, [usuario]);

  return (

      <main className="space-y-6 p-6">
        <h2 className="text-2xl font-bold">Panel Psicorientador</h2>

        <div className="grid grid-cols-12 gap-4">
          {cargando ? (
            <>
              <Esqueleto className="h-24 col-span-4 w-full" />
              <Esqueleto className="h-24 col-span-4 w-full" />
              <Esqueleto className="h-24 col-span-4 w-full" />
            </>
          ) : (
            <>
              <div className="col-span-4">
                <Card
                  label="Alertas pendientes"
                  total={resumen.alertasPendientesPsico}
                  icon={FileText}
                  bgColor="bg-pink-500"
                  onClick={() => navigate("/consultas?estado=pendiente")}
                />
              </div>
              <div className="col-span-4">
                <Card
                  label="Alertas completadas"
                  total={resumen.alertasCompletadasPsico}
                  icon={Users}
                  bgColor="bg-sky-500"
                  onClick={() => navigate("/consultas?estado=completado")}
                />
              </div>
              <div className="col-span-4">
                <Card
                  label="Citas asignadas"
                  total={resumen.citasAsignadasPsico}
                  icon={CalendarClock}
                  bgColor="bg-purple-500"
                  onClick={() => navigate("/citas")}
                />
              </div>
            </>
          )}
        </div>

        <section>
          <ListadoEstudiantesPendientes />
        </section>
      </main>
 
  );
};
