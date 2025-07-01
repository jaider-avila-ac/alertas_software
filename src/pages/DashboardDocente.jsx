import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { totalEstudiantes } from "../services/estudianteService";
import { totalConsultas, obtenerTodasConsultas } from "../services/consultaService";
import { alertaVisual } from "../utils/alertaVisual";
import { Layout } from "../layout/Layout";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { AlertaCard } from "../components/AlertaCard";
import { Esqueleto } from "../components/Esqueleto";
import { Users, AlertTriangle, BarChart4, Plus } from "lucide-react";
import { AlertasContext } from "../context/AlertasContext";
import { GraficoNiveles } from "../components/graficos/GraficoNiveles";
import { UserContext } from "../context/UserContext";

export const DashboardDocente = () => {
  const [resumen, setResumen] = useState({ estudiantes: 0, alertas: 0, seguimientos: 0 });
  const [cargando, setCargando] = useState(true);
  const { alertas, setAlertas } = useContext(AlertasContext);
  const [alertasDocente, setAlertasDocente] = useState([]);
  const { usuario } = useContext(UserContext);
  const docenteId = usuario?.id;
  const navigate = useNavigate();

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

        const res = await obtenerTodasConsultas();
        const datos = res.data || [];

        const filtradas = datos.filter((c) => c.docenteId === docenteId);

        const procesadas = filtradas.map((c) => {
          const nivel = c.nivel?.toLowerCase();
          const visual = alertaVisual[nivel] || {};
          return {
            id: c.id,
            nombreEstudiante: c.nombreEstudiante,
            motivo: c.motivo,
            fecha: c.fecha ? new Date(c.fecha).toLocaleDateString() : "Sin fecha",
            estado: c.estado,
            nivel,
            icono: visual.icono,
            color: visual.color,
          };
        });

        setAlertas(procesadas);
        setAlertasDocente(procesadas);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [docenteId]);

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
          <div className="col-span-12 md:col-span-8 space-y-2 md:overflow-y-auto md:max-h-[500px]">
            {cargando ? (
              Array(3)
                .fill(0)
                .map((_, i) => <Esqueleto key={i} className="h-24 w-full rounded" />)
            ) : alertasDocente.length > 0 ? (
              alertasDocente.map((alerta) => (
                <AlertaCard key={alerta.id} alerta={alerta} />
              ))
            ) : (
              <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
                No tienes alertas creadas.
              </div>
            )}
          </div>
          <div className="hidden md:block md:col-span-4">
            <GraficoNiveles data={alertasDocente} />
          </div>
        </div>
      </main>
    </Layout>
  );
};
