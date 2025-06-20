import { useEffect, useState } from "react";
import { Layout } from "../layout/Layout";
import { obtenerEstadisticas } from "../services/estadisticaService";
import { GraficoResumen } from "../components/graficos/GraficoResumen";
import { GraficoNiveles } from "../components/graficos/GraficoNiveles";
import { GraficoEstados } from "../components/graficos/GraficoEstados";
import { GraficoPromedios } from "../components/graficos/GraficoPromedios";
import { GraficoConsultasPorMes } from "../components/graficos/GraficoConsultasPorMes";


export const EstadisticasPage = () => {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const res = await obtenerEstadisticas();
      setDatos(res.data);
    };
    cargar();
  }, []);

  if (!datos) return <div className="p-4">Cargando estadísticas...</div>;

  return (
    <Layout>
      <main className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">Estadísticas Generales</h2>
        <GraficoResumen data={datos} />

        <div className="grid grid-cols-12 gap-4">
          <GraficoNiveles data={datos} />
          <GraficoEstados data={datos} />
          <GraficoPromedios data={datos} />
        </div>

        <div className="grid grid-cols-12 gap-4">
         <GraficoConsultasPorMes data={datos} />
        </div>


       

      </main>
    </Layout>
  );
};
