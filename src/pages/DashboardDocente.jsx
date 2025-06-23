import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { totalEstudiantes } from "../services/estudianteService";
import { totalConsultas } from "../services/consultaService";
import { procesarConsultas } from "../utils/procesarConsultas";
import { alertaVisual } from "../utils/alertaVisual";
import { Layout } from "../layout/Layout";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { AlertaCard } from "../components/AlertaCard";
import { Chart } from "../components/Chart";
import { Esqueleto } from "../components/Esqueleto";
import { Users, AlertTriangle, BarChart4, Plus } from "lucide-react";
import { AlertasContext } from "../context/AlertasContext";
import { GraficoNiveles } from "../components/graficos/GraficoNiveles";


export const DashboardDocente = () => {
  const [resumen, setResumen] = useState({ estudiantes: 0, alertas: 0, seguimientos: 0 });
  const [cargando, setCargando] = useState(true);
  const { alertas, setAlertas } = useContext(AlertasContext);
  const [alertasDocente, setAlertasDocente] = useState(alertas || []);
  const navigate = useNavigate();
  const docenteId = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resEstudiantes, resAlertas] = await Promise.all([
          totalEstudiantes(),
          totalConsultas(),
        ]);

        setResumen({
          estudiantes: resEstudiantes.data,
          alertas: resAlertas.data,
          seguimientos: 0,
        });

        if (!alertas) {
          const consultas = await procesarConsultas(docenteId);
          const procesadas = consultas.map((c) => {
            const nivel = c.alerta?.toLowerCase();
            const visual = alertaVisual[nivel] || {};
            return {
              ...c,
              nivel,
              icono: visual.icono,
              color: visual.color,
              fecha: c.fecha ? new Date(c.fecha).toLocaleDateString() : "Sin fecha",
            };
          });
          setAlertas(procesadas);
          setAlertasDocente(procesadas);
        }
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [alertas, setAlertas]);

  return (
    <Layout>
      <main className="flex-1 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Panel Docente</h2>
          <Button
            text="Crear alerta"
            color="bg-pink-500"
            icon={Plus}
            onClick={() => navigate("/consultas/nueva")}
          />
        </div>

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
                  label="Estudiantes"
                  total={resumen.estudiantes}
                  icon={Users}
                  bgColor="bg-sky-500"
                  onClick={() => navigate("/estudiantes")}
                />
              </div>
              <div className="col-span-4">
                <Card
                  label="Alertas"
                  total={resumen.alertas}
                  icon={AlertTriangle}
                  bgColor="bg-amber-400"
                  onClick={() => navigate("/consultas")}
                />
              </div>
              <div className="col-span-4">
                <Card
                  label="Estadísticas"
                  total={100}
                  icon={BarChart4}
                  bgColor="bg-emerald-400"
                  onClick={() => navigate("/estadisticas")}
                />
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 space-y-2 overflow-y-auto max-h-[500px] pr-2">
            {cargando
              ? Array(3)
                  .fill(0)
                  .map((_, i) => <Esqueleto key={i} className="h-24 w-full rounded" />)
              : alertasDocente.map((alerta) => (
                  <AlertaCard key={alerta.id} alerta={alerta} />
                ))}
          </div>

          <div className="col-span-4">
          
           <GraficoNiveles />
          </div>
        </div>
      </main>
    </Layout>
  );
};
