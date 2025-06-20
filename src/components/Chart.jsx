import { useEffect, useState } from "react";
import { obtenerEstadisticas } from "../services/estadisticaService";
import { GraficoNiveles } from "../components/graficos/GraficoNiveles";

export const Chart = () => {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const res = await obtenerEstadisticas();
      setDatos(res.data);
    };
    cargar();
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded w-full h-60">
      {datos ? (
        <GraficoNiveles data={datos} />
      ) : (
        <p className="text-gray-500">Cargando gráfico...</p>
      )}
    </div>
  );
};
