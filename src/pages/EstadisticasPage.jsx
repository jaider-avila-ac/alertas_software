import { useEffect, useState, useContext, useRef } from "react";
import { Layout } from "../layout/Layout";
import { obtenerEstadisticas } from "../services/estadisticaService";
import { GraficoResumen } from "../components/graficos/GraficoResumen";
import { GraficoNiveles } from "../components/graficos/GraficoNiveles";
import { GraficoEstados } from "../components/graficos/GraficoEstados";
import { GraficoPromedios } from "../components/graficos/GraficoPromedios";
import { GraficoConsultasPorMes } from "../components/graficos/GraficoConsultasPorMes";
import { UserContext } from "../context/UserContext";
import { ReportePDF } from "../components/ReportePDF";
import html2pdf from "html2pdf.js";
import { Button } from "../components/Button";
import { FileText } from "lucide-react";
import { Esqueleto } from "../components/Esqueleto";

export const EstadisticasPage = () => {
  const [datos, setDatos] = useState(null);
  const { usuario } = useContext(UserContext);
  const refPDF = useRef();

  useEffect(() => {
    const cargar = async () => {
      const res = await obtenerEstadisticas();
      setDatos(res.data);
    };
    cargar();
  }, []);

  const generarPDF = () => {
    const opciones = {
      margin: 0.5,
      filename: "reporte_alertas.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opciones).from(refPDF.current).save();
  };

if (!datos) {
  return (
    <Layout>
      <main className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">Estadísticas Generales</h2>
        
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Esqueleto className="h-40 w-full" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Esqueleto className="h-48 w-full" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Esqueleto className="h-48 w-full" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Esqueleto className="h-48 w-full" />
          </div>
          <div className="col-span-12">
            <Esqueleto className="h-80 w-full" />
          </div>
        </div>
      </main>
    </Layout>
  );
}

  return (
    <Layout>
      <main className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Estadísticas Generales</h2>
          {usuario?.rol === 3 && (
            <Button
              text="Generar PDF"
              icon={FileText}
              color="bg-purple-600"
              onClick={generarPDF}
              title="Exportar reporte"
            />
          )}
        </div>

        {/* Componente oculto solo para generar el PDF */}
        <div style={{ display: "none" }}>
          <ReportePDF datos={datos} ref={refPDF} />
        </div>

        {/* Gráficos visibles */}
        <GraficoResumen data={datos} />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4">
            <GraficoNiveles data={datos} />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <GraficoEstados data={datos} />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <GraficoPromedios data={datos} />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <GraficoConsultasPorMes data={datos} />
          </div>
        </div>
      </main>
    </Layout>
  );
};
