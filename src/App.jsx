import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { EstudiantePage } from "./pages/EstudiantePage";
import { PageAlertas } from "./pages/PageAlertas";
import { EstudianteDetalle } from "./pages/EstudianteDetalle";
import { AlertaNueva } from "./pages/AlertaNueva";
import { SeguimientosPorConsulta } from "./pages/SeguimientosPorConsulta";
import { EstadisticasPage } from "./pages/EstadisticasPage";
import { CitasPage } from "./pages/CitasPage";
import { AlertasPage } from "./pages/AlertasPage";
import { CitaActiva } from "./components/psico/CitaActiva"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/estudiantes" element={<EstudiantePage />} />
        <Route path="/consultas" element={<PageAlertas />} />
        <Route path="/consultas/nueva" element={<AlertaNueva />} />
        <Route path="/consultas/nueva/:id" element={<AlertaNueva />} />
        <Route path="/estudiantes/:id" element={<EstudianteDetalle />} />
        <Route path="/seguimientos/:id" element={<SeguimientosPorConsulta />} />
        <Route path="/estadisticas" element={<EstadisticasPage />} />
        <Route path="/psicorientador/citas" element={<CitasPage />} />
        <Route path="/alertas" element={<AlertasPage />} />
        <Route path="/psicorientador/citas/activa/:id" element={<CitaActiva />} />
        <Route path="/crear-alerta" element={<AlertaNueva />} />

      </Routes>
    </Router>
  );
}

export default App;
