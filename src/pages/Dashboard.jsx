import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { DashboardDocente } from "./DashboardDocente";
import { DashboardPsicorientador } from "./DashboardPsicorientador";
import { DashboardEstudiante } from "./DashboardEstudiante";
import { DashboardAdmin } from "./DashboardAdmin"; 

export const Dashboard = () => {
  const { usuario } = useContext(UserContext);

  if (usuario.rol === 0) return <DashboardDocente />;
  if (usuario.rol === 1) return <DashboardEstudiante />;
  if (usuario.rol === 2) return <DashboardPsicorientador />;
  if (usuario.rol === 3) return <DashboardAdmin />; 

  return <div>Rol no permitido</div>;
};
