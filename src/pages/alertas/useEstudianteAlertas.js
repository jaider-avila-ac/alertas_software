import { useState, useEffect } from "react";
import { procesarConsultas } from "../../utils/procesarConsultas";

export const useEstudianteAlertas = () => {
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datos = await procesarConsultas();

        const mapa = {};
        datos.forEach((c) => {
          const key = c.estudianteId;
          if (!mapa[key]) {
            mapa[key] = {
              estudianteId: c.estudianteId,
              nombreEstudiante: c.nombreEstudiante || "Sin nombre",
              total: 0,
              pendientes: 0,
            };
          }
          mapa[key].total += 1;
          if (c.estado === "pendiente") mapa[key].pendientes += 1;
        });

        setGrupos(Object.values(mapa).sort((a, b) => b.total - a.total));
      } catch (err) {
        console.error("Error cargando grupos de alertas:", err);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  return { grupos, cargando };
};
