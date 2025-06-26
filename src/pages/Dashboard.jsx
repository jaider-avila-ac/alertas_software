// src/pages/Dashboard.jsx
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { DashboardDocente } from "./DashboardDocente";
import { DashboardPsicorientador } from "./DashboardPsicorientador";

export const Dashboard = () => {
  const { usuario } = useContext(UserContext);

  if (usuario.rol === 0) return <DashboardDocente />;
  if (usuario.rol === 2) return <DashboardPsicorientador />;

  return <div>Rol no permitido</div>;
};
