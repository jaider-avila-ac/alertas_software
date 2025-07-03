import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Layout } from "../layout/Layout";
import { Card } from "../components/Card";
import { Users, UserPlus, BarChart4 } from "lucide-react";

import { UserContext } from "../context/UserContext";
import { obtenerResumenDashboard } from "../services/dashboardService";
import { Esqueleto } from "../components/Esqueleto";

export const DashboardAdmin = () => {
  const navigate = useNavigate();
  const { usuario } = useContext(UserContext); // para usar usuario.id si es necesario
  const [cargando, setCargando] = useState(true);

  const [resumen, setResumen] = useState({
    totalEstudiantes: 0,
    totalDocentes: 0,
    totalPsicos: 0,
    totalCitas: 0,
    totalSeguimientos: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await obtenerResumenDashboard(3, usuario?.id || 0); // rol 3 = admin
        setResumen(res.data);
      } catch (error) {
        console.error("Error al cargar resumen del administrador:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [usuario]);

  return (
 
      <main className="flex-1 space-y-6">
        <h2 className="text-2xl font-bold">Panel del Administrador</h2>

        <div className="grid grid-cols-12 gap-4">
          {cargando ? (
            <>
              <Esqueleto className="h-24 col-span-4 w-full" />
              <Esqueleto className="h-24 col-span-4 w-full" />
              <Esqueleto className="h-24 col-span-4 w-full" />
            </>
          ) : (
            <>
              <div className="col-span-12 md:col-span-4">
                <Card
                  label="Estudiantes"
                  total={resumen.totalEstudiantes}
                  icon={Users}
                  bgColor="bg-sky-500"
                  onClick={() => navigate("/estudiantes")}
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <Card
                  label="Docentes"
                  total={resumen.totalDocentes}
                  icon={UserPlus}
                  bgColor="bg-indigo-500"
                  onClick={() => navigate("/docentes")}
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <Card
                  label="Psicorientadores"
                  total={resumen.totalPsicos}
                  icon={UserPlus}
                  bgColor="bg-pink-500"
                  onClick={() => navigate("/psicos")}
                />
              </div>
            </>
          )}
        </div>

      </main>

  );
};
