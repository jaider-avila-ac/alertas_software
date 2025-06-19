import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardDocente } from "./pages/DashboardDocente";
import { EstudiantePage } from "./pages/EstudiantePage";
import { PageAlertas } from "./pages/PageAlertas";
import { EstudianteDetalle } from "./pages/EstudianteDetalle";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardDocente />} />
        <Route path="/estudiantes" element={<EstudiantePage />} />
        <Route path="/alertas" element={<PageAlertas />} />
         <Route path="/estudiantes/:id" element={<EstudianteDetalle />} />

      </Routes>
    </Router>
  );
}

export default App;
