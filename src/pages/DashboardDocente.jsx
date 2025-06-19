import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerTodosEstudiantes, totalEstudiantes } from "../services/estudianteService";
import { totalConsultas, obtenerTodasConsultas } from "../services/consultaService";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { alertaVisual } from "../utils/alertaVisual";
import { AlertaCard } from "../components/AlertaCard";
import { Chart } from "../components/Chart";
import { Users, AlertTriangle, ClipboardList, Plus } from "lucide-react";

export const DashboardDocente = () => {
  const [resumen, setResumen] = useState({ estudiantes: 0, alertas: 0, seguimientos: 0 });
  const [alertasRecientes, setAlertasRecientes] = useState([]);
  const navigate = useNavigate();
  const usuario = { nombre: "Docente Demo", rol: "Docente" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resEstudiantes, resAlertas, resConsultas] = await Promise.all([
          totalEstudiantes(),
          totalConsultas(),
          obtenerTodasConsultas(),
        ]);

        setResumen({
          estudiantes: resEstudiantes.data,
          alertas: resAlertas.data,
          seguimientos: 0,
        });

        const ordenadas = resConsultas.data
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 5)
          .map((c) => {
            const nivel = c.alerta?.toLowerCase(); // "leve", "moderado", etc.
            const visual = alertaVisual[nivel] || {};
            const fecha = new Date(c.fecha).toLocaleDateString();

            return {
              id: c.id,
              nombre: `${c.estudianteNombres} ${c.estudianteApellidos}`,
              motivo: c.motivo,
              fecha: fecha,
              estado: c.estado?.toLowerCase(),
              nivel,
              icono: visual.icono,
              color: visual.color,
            };
          });

        setAlertasRecientes(ordenadas);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header nombre={usuario.nombre} rol={usuario.rol} />
        <main className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Panel Docente</h2>
            <Button text="Crear alerta" color="bg-blue-600" icon={Plus} onClick={() => {}} />
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
                onClick={() => navigate("/alertas")}
              />
            </div>
            <div className="col-span-4">
              <Card
                label="Seguimientos"
                total={resumen.seguimientos}
                icon={ClipboardList}
                bgColor="bg-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 space-y-2 overflow-y-auto max-h-[500px] pr-2">
              {alertasRecientes.map((alerta) => (
                <AlertaCard key={alerta.id} alerta={alerta} />
              ))}
            </div>
            <div className="col-span-4">
              <Chart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
