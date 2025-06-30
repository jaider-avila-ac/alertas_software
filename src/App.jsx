import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

// 👇 Nuevos imports para psicorientadores
import { PsicoPage } from "./pages/PsicoPage";
import { PageFormularioPsico } from "./pages/PageFormularioPsico";

function App() {
  return (
    <Router>
      <Routes>
        {/* Panel principal */}
        <Route path="/" element={<Dashboard />} />

        {/* Estudiantes y consultas */}
        <Route path="/estudiantes" element={<EstudiantePage />} />
        <Route path="/estudiantes/:id" element={<EstudianteDetalle />} />
        <Route path="/consultas" element={<PageAlertas />} />
        <Route path="/consultas/nueva" element={<AlertaNueva />} />
        <Route path="/consultas/nueva/:id" element={<AlertaNueva />} />
        <Route path="/editar-alerta/:id" element={<AlertaNueva />} />

        {/* Seguimientos y citas */}
        <Route path="/seguimientos" element={<EstudiantePage />} />
        <Route path="/seguimientos/:id" element={<SeguimientosPorConsulta />} />
        <Route path="/citas" element={<CitasPage />} />
        <Route path="/citas/activa/:id" element={<CitaActiva />} />

        {/* Alertas y perfil */}
        <Route path="/alertas" element={<AlertasPage />} />
        <Route path="/mis-alertas" element={<AlertasEstudiante />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/estadisticas" element={<EstadisticasPage />} />

        {/* Administración de estudiantes */}
        <Route path="/formulario-estudiante" element={<PageFormularioEstudiante />} />
        <Route path="/formulario-estudiante/:id" element={<PageFormularioEstudiante />} />

        {/* Administración de docentes */}
        <Route path="/docentes" element={<DocentePage />} />
        <Route path="/formulario-docente" element={<PageFormularioDocente />} />
        <Route path="/formulario-docente/:id" element={<PageFormularioDocente />} />

        {/* Administración de psicorientadores */}
        <Route path="/psicos" element={<PsicoPage />} />
        <Route path="/formulario-psico" element={<PageFormularioPsico />} />
        <Route path="/formulario-psico/:id" element={<PageFormularioPsico />} />
      </Routes>
    </Router>
  );
}

export default App;
