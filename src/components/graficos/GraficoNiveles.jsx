import { useEffect, useState, useContext } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { obtenerEstadisticas } from "../../services/estadisticaService";
import { AlertasContext } from "../../context/AlertasContext";
import { Esqueleto } from "../Esqueleto";

const COLORS = ["#c084fc", "#f826a9", "#fbbf24", "#34d399"];

export const GraficoNiveles = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const { alertas } = useContext(AlertasContext);

  useEffect(() => {
    const cargar = async () => {
      if (!alertas) {
        try {
          const res = await obtenerEstadisticas();
          setEstadisticas(res.data);
        } catch (error) {
          console.error("Error al obtener estadísticas:", error);
        }
      } else {
        // Si hay alertas, generar conteo local
        const conteo = {
          alertasCritico: 0,
          alertasAlto: 0,
          alertasModerado: 0,
          alertasLeve: 0,
        };

        alertas.forEach((a) => {
          const nivel = a.nivel?.toLowerCase();
          if (nivel === "crítico" || nivel === "critico") conteo.alertasCritico++;
          else if (nivel === "alto") conteo.alertasAlto++;
          else if (nivel === "moderado") conteo.alertasModerado++;
          else if (nivel === "leve") conteo.alertasLeve++;
        });

        setEstadisticas(conteo);
      }
    };

    cargar();
  }, [alertas]);

  if (!estadisticas) {
    return <Esqueleto className="w-full h-60 rounded" />;
  }

  const niveles = [
    { name: "Crítico", value: estadisticas.alertasCritico },
    { name: "Alto", value: estadisticas.alertasAlto },
    { name: "Moderado", value: estadisticas.alertasModerado },
    { name: "Leve", value: estadisticas.alertasLeve },
  ];

  const renderLabel = ({ name, value }) => `${name}: ${value}`;

  return (
    <div className="bg-white p-4 rounded shadow col-span-4">
      <h3 className="font-semibold text-lg mb-2">Alertas por Nivel</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={niveles}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            innerRadius={40}
            paddingAngle={5}
            label={renderLabel}
          >
            {niveles.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
