import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { PageLogin } from "./pages/PageLogin";


import { Dashboard } from "./pages/Dashboard";
import { EstudiantePage } from "./pages/EstudiantePage";
import { EstudianteDetalle } from "./pages/EstudianteDetalle";
import { PageAlertas } from "./pages/PageAlertas";
import { AlertaNueva } from "./pages/AlertaNueva";
import { SeguimientosPorConsulta } from "./pages/SeguimientosPorConsulta";
import { EstadisticasPage } from "./pages/EstadisticasPage";
import { CitasPage } from "./pages/CitasPage";
import { AlertasPage } from "./pages/AlertasPage";
import { AlertasEstudiante } from "./pages/AlertasEstudiante";
import { CitaActiva } from "./components/psico/CitaActiva";
import { PerfilPage } from "./pages/PerfilPage";
import { PageFormularioEstudiante } from "./pages/PageFormularioEstudiante";
import { DocentePage } from "./pages/DocentePage";
import { PageFormularioDocente } from "./pages/PageFormularioDocente";
import { PsicoPage } from "./pages/PsicoPage";
import { PageFormularioPsico } from "./pages/PageFormularioPsico";

const estaAutenticado = () => {
  return !!localStorage.getItem("usuario");
};

function App() {
  return (
    <Router>
      <Routes>
  
        <Route path="/login" element={<PageLogin />} />


        {estaAutenticado() && (
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="estudiantes" element={<EstudiantePage />} />
            <Route path="estudiantes/:id" element={<EstudianteDetalle />} />

            <Route path="consultas" element={<PageAlertas />} />
            <Route path="consultas/nueva" element={<AlertaNueva />} />
            <Route path="consultas/nueva/:id" element={<AlertaNueva />} />
            <Route path="editar-alerta/:id" element={<AlertaNueva />} />

            <Route path="seguimientos" element={<EstudiantePage />} />
            <Route path="seguimientos/:id" element={<SeguimientosPorConsulta />} />

            <Route path="citas" element={<CitasPage />} />
            <Route path="citas/activa/:id" element={<CitaActiva />} />

            <Route path="alertas" element={<AlertasPage />} />
            <Route path="mis-alertas" element={<AlertasEstudiante />} />
            <Route path="perfil" element={<PerfilPage />} />
            <Route path="estadisticas" element={<EstadisticasPage />} />

            <Route path="formulario-estudiante" element={<PageFormularioEstudiante />} />
            <Route path="formulario-estudiante/:id" element={<PageFormularioEstudiante />} />

            <Route path="docentes" element={<DocentePage />} />
            <Route path="formulario-docente" element={<PageFormularioDocente />} />
            <Route path="formulario-docente/:id" element={<PageFormularioDocente />} />

            <Route path="psicos" element={<PsicoPage />} />
            <Route path="formulario-psico" element={<PageFormularioPsico />} />
            <Route path="formulario-psico/:id" element={<PageFormularioPsico />} />
          </Route>
        )}

        {/* si no esta aurenticado ir al login */}
        {!estaAutenticado() && (
          <Route path="*" element={<PageLogin />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
