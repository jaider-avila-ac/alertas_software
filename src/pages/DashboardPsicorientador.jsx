import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../layout/Layout";
import { Card } from "../components/Card";
import { Esqueleto } from "../components/Esqueleto";
import { CalendarClock, FileText, Users } from "lucide-react";

import { obtenerCitasPorPsico } from "../services/citaService"; // ✅ usa el seguro
import { obtenerTodasConsultas } from "../services/consultaService";
import { UserContext } from "../context/UserContext";
import { ListadoEstudiantesPendientes } from "../components/psico/ListadoEstudiantesPendientes";

export const DashboardPsicorientador = () => {
  const [resumen, setResumen] = useState({
    alertasPendientes: 0,
    alertasCompletadas: 0,
    citas: 0,
  });
  const [cargando, setCargando] = useState(true);
  const { usuario } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarResumen = async () => {
      try {
        const [resConsultas, resCitas] = await Promise.all([
          obtenerTodasConsultas(),
          obtenerCitasPorPsico(usuario.id), // ✅ solo citas del psico actual
        ]);

        const consultas = resConsultas.data || [];

        const alertasPendientes = consultas.filter(c => c.estado === "pendiente").length;
        const alertasCompletadas = consultas.filter(c => c.estado === "completado").length;

        setResumen({
          alertasPendientes,
          alertasCompletadas,
          citas: resCitas.data.length, // ✅ ya viene filtrado
        });
      } catch (error) {
        console.error("Error cargando resumen del psicorientador:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarResumen();
  }, []);

  return (
    <Layout>
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
                  total={resumen.alertasPendientes}
                  icon={FileText}
                  bgColor="bg-pink-500"
                  onClick={() => navigate("/consultas?estado=pendiente")}
                />
              </div>
              <div className="col-span-4">
                <Card
                  label="Alertas completadas"
                  total={resumen.alertasCompletadas}
                  icon={Users}
                  bgColor="bg-sky-500"
                  onClick={() => navigate("/consultas?estado=completado")}
                />
              </div>
              <div className="col-span-4">
                <Card
                  label="Citas asignadas"
                  total={resumen.citas}
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
    </Layout>
  );
};
