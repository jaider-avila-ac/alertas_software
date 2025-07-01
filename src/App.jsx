import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Vistas protegidas
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


import { PageLogin } from "./pages/PageLogin";

const estaAutenticado = () => {
  return !!localStorage.getItem("usuario");
};

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<PageLogin />} />


        <Route path="/" element={estaAutenticado() ? <Dashboard /> : <PageLogin />} />

     
        <Route path="/estudiantes" element={estaAutenticado() ? <EstudiantePage /> : <PageLogin />} />
        <Route path="/estudiantes/:id" element={estaAutenticado() ? <EstudianteDetalle /> : <PageLogin />} />
        <Route path="/consultas" element={estaAutenticado() ? <PageAlertas /> : <PageLogin />} />
        <Route path="/consultas/nueva" element={estaAutenticado() ? <AlertaNueva /> : <PageLogin />} />
        <Route path="/consultas/nueva/:id" element={estaAutenticado() ? <AlertaNueva /> : <PageLogin />} />
        <Route path="/editar-alerta/:id" element={estaAutenticado() ? <AlertaNueva /> : <PageLogin />} />


        <Route path="/seguimientos" element={estaAutenticado() ? <EstudiantePage /> : <PageLogin />} />
        <Route path="/seguimientos/:id" element={estaAutenticado() ? <SeguimientosPorConsulta /> : <PageLogin />} />
        <Route path="/citas" element={estaAutenticado() ? <CitasPage /> : <PageLogin />} />
        <Route path="/citas/activa/:id" element={estaAutenticado() ? <CitaActiva /> : <PageLogin />} />


        <Route path="/alertas" element={estaAutenticado() ? <AlertasPage /> : <PageLogin />} />
        <Route path="/mis-alertas" element={estaAutenticado() ? <AlertasEstudiante /> : <PageLogin />} />
        <Route path="/perfil" element={estaAutenticado() ? <PerfilPage /> : <PageLogin />} />
        <Route path="/estadisticas" element={estaAutenticado() ? <EstadisticasPage /> : <PageLogin />} />


        <Route path="/formulario-estudiante" element={estaAutenticado() ? <PageFormularioEstudiante /> : <PageLogin />} />
        <Route path="/formulario-estudiante/:id" element={estaAutenticado() ? <PageFormularioEstudiante /> : <PageLogin />} />

        <Route path="/docentes" element={estaAutenticado() ? <DocentePage /> : <PageLogin />} />
        <Route path="/formulario-docente" element={estaAutenticado() ? <PageFormularioDocente /> : <PageLogin />} />
        <Route path="/formulario-docente/:id" element={estaAutenticado() ? <PageFormularioDocente /> : <PageLogin />} />

 
        <Route path="/psicos" element={estaAutenticado() ? <PsicoPage /> : <PageLogin />} />
        <Route path="/formulario-psico" element={estaAutenticado() ? <PageFormularioPsico /> : <PageLogin />} />
        <Route path="/formulario-psico/:id" element={estaAutenticado() ? <PageFormularioPsico /> : <PageLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
