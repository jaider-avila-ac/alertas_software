import { useEffect, useState } from "react";
import { obtenerEstadisticas } from "../services/estadisticaService";
import { GraficoNiveles } from "../components/graficos/GraficoNiveles";
import { Esqueleto } from "../components/Esqueleto";

export const Chart = () => {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await obtenerEstadisticas();
        setDatos(res.data);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };
    cargar();
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded w-full h-60">
      {datos ? (
        <GraficoNiveles data={datos} />
      ) : (
        <Esqueleto className="w-full h-full rounded" />
      )}
    </div>
  );
};
