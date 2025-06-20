import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { totalEstudiantes } from "../services/estudianteService";
import { totalConsultas } from "../services/consultaService";
import { procesarConsultas } from "../utils/procesarConsultas";
import { Layout } from "../layout/Layout";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { alertaVisual } from "../utils/alertaVisual";
import { AlertaCard } from "../components/AlertaCard";
import { Chart } from "../components/Chart";
import { Users, AlertTriangle, BarChart4, Plus } from "lucide-react";


export const DashboardDocente = () => {
  const [resumen, setResumen] = useState({ estudiantes: 0, alertas: 0, seguimientos: 0 });
  const [alertasDocente, setAlertasDocente] = useState([]);
  const navigate = useNavigate();


  const docenteId = 1; // bueno aqui debo es recibirlo desde un token

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

        setAlertasDocente(procesadas);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (


    <Layout>
      <main className="flex-1  space-y-4">
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
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 space-y-2 overflow-y-auto max-h-[500px] pr-2">
            {alertasDocente.map((alerta) => (
              <AlertaCard key={alerta.id} alerta={alerta} />
            ))}
          </div>
          <div className="col-span-4">
            <Chart />
          </div>
        </div>
      </main>


    </Layout>



  );
};
