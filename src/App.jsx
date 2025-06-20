import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardDocente } from "./pages/DashboardDocente";
import { EstudiantePage } from "./pages/EstudiantePage";
import { PageAlertas } from "./pages/PageAlertas";
import { EstudianteDetalle } from "./pages/EstudianteDetalle";
import { AlertaNueva } from "./pages/AlertaNueva";
import { SeguimientosPorConsulta } from "./pages/SeguimientosPorConsulta";
import { EstadisticasPage } from "./pages/EstadisticasPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardDocente />} />
        <Route path="/estudiantes" element={<EstudiantePage />} />
        <Route path="/consultas" element={<PageAlertas />} />
        <Route path="/consultas/nueva" element={<AlertaNueva />} />
        <Route path="/consultas/nueva/:id" element={<AlertaNueva />} />
        <Route path="/estudiantes/:id" element={<EstudianteDetalle />} />
        <Route path="/seguimientos/:id" element={<SeguimientosPorConsulta />} />
        <Route path="/estadisticas" element={<EstadisticasPage />} />
      </Routes>
    </Router>
  );
}

export default App;
