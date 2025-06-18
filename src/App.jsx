import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardDocente } from "./pages/DashboardDocente";
import { EstudiantePage } from "./pages/EstudiantePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardDocente />} />
       <Route path="/estudiantes" element={<EstudiantePage />} />

      </Routes>
    </Router>
  );
}

export default App;
