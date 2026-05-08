import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SLUG_KEY } from "../config/config";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../pages/Login/LoginPage";
import RegistroPage from "../pages/Registro/RegistroPage";
import InstitucionesPage from "../pages/SuperAdmin/InstitucionesPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import DocentesPage from "../pages/Docentes/DocentesPage";
import DocenteFormPage from "../pages/Docentes/DocenteFormPage";
import EstudiantesPage from "../pages/Estudiantes/EstudiantesPage";
import EstudianteFormPage from "../pages/Estudiantes/EstudianteFormPage";
import GradosYGruposPage from "../pages/Grados/GradosYGruposPage";
import GrupoEstudiantesPage from "../pages/Grupos/GrupoEstudiantesPage";
import MateriasPage from "../pages/Materias/MateriasPage";
import AnioAcademicoPage from "../pages/AnioAcademico/AnioAcademicoPage";
import MatriculasPage from "../pages/Matriculas/MatriculasPage";
import AsignacionesPage from "../pages/Asignaciones/AsignacionesPage";
import DetalleEstudiantePage from "../pages/Estudiantes/DetalleEstudiantePage";
import PerfilPage from "../pages/Perfil/PerfilPage";

import MisAsignacionesPage from "../pages/Docentes/MisAsignacionesPage";
import CalificarPage from "../pages/Docentes/CalificarPage";

/**
 * Layout protegido que valida slug y autenticación
 */
function ProtectedRoute() {
  const { token } = useAuth();
  const { slug } = useParams();

  if (!token) {
    // Prioriza el slug de la URL actual para no perder el contexto de institución
    const fallback = slug || localStorage.getItem(SLUG_KEY) || '';
    return <Navigate to={`/${fallback}`} replace />;
  }

  return <AppLayout />;
}

/**
 * Root: redirige según si hay token y slug guardado
 */
function RootPage() {
  const { token } = useAuth();
  const savedSlug = localStorage.getItem(SLUG_KEY);

  if (token && savedSlug) {
    return <Navigate to={`/${savedSlug}/dashboard`} replace />;
  }
  return <Navigate to="/registro" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Raíz */}
        <Route path="/" element={<RootPage />} />

        {/* Registro (público, sin slug) */}
        <Route path="/registro" element={<RegistroPage />} />

        {/* Login por slug */}
        <Route path="/:slug" element={<LoginPage />} />

        {/* Rutas protegidas CON slug - Layout anidado correctamente */}
        <Route path="/:slug" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="super-admin/instituciones" element={<InstitucionesPage />} />
          <Route path="docentes" element={<DocentesPage />} />
          <Route path="docentes/nuevo" element={<DocenteFormPage />} />
          <Route path="docentes/editar/:id" element={<DocenteFormPage />} />
          <Route path="estudiantes" element={<EstudiantesPage />} />
          <Route path="estudiantes/nuevo" element={<EstudianteFormPage />} />
          <Route path="estudiantes/editar/:id" element={<EstudianteFormPage />} />
          <Route path="estudiantes/notas/:id" element={<DetalleEstudiantePage />} />
          <Route path="grados/:gradoId/grupos/:grupoId/estudiantes" element={<GrupoEstudiantesPage />} />
          <Route path="materias" element={<MateriasPage />} />
          <Route path="anio-academico" element={<AnioAcademicoPage />} />
          <Route path="matriculas" element={<MatriculasPage />} />
          <Route path="asignaciones" element={<AsignacionesPage />} />
          <Route path="grados" element={<GradosYGruposPage />} />


          <Route path="mi-grupo" element={<GrupoEstudiantesPage />} />
          <Route path="mis-notas" element={<DetalleEstudiantePage />} />
          <Route path="mi-perfil" element={<PerfilPage />} />

          <Route path="mis-asignaciones" element={<MisAsignacionesPage />} />
          <Route path="calificar/:asignacionId" element={<CalificarPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}