import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Esqueleto } from "../components/Esqueleto";
import { CalendarClock, FileText, Users } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { ListadoEstudiantesPendientes } from "../components/psico/ListadoEstudiantesPendientes";
import { obtenerResumenDashboard } from "../services/dashboardService";

let _cacheResumen = null;

export const DashboardPsicorientador = () => {
  const [resumen,  setResumen]  = useState(_cacheResumen ?? {
    alertasPendientesPsico:   0,
    alertasCompletadasPsico:  0,
    citasAsignadasPsico:      0,
  });
  const [cargando, setCargando] = useState(!_cacheResumen);

  const { usuario } = useContext(UserContext);
  const navigate    = useNavigate();

  useEffect(() => {
    if (!usuario?.id) return;
    let active = true;

    obtenerResumenDashboard(usuario.rol, usuario.id)
      .then((res) => {
        if (!active) return;
        _cacheResumen = res.data;
        setResumen(res.data);
      })
      .catch((err) => console.error("Error cargando resumen del psicorientador:", err))
      .finally(() => { if (active) setCargando(false); });

    return () => { active = false; };
  }, [usuario]);

  return (
    <main className="space-y-6">
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
                onClick={() => navigate("/consultas")}
              />
            </div>
            <div className="col-span-4">
              <Card
                label="Alertas completadas"
                total={resumen.alertasCompletadasPsico}
                icon={Users}
                bgColor="bg-sky-500"
                onClick={() => navigate("/consultas")}
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
