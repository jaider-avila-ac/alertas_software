import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";

export const GraficoEstados = ({ data }) => {
  const estados = [
    { name: "Pendientes", value: Number(data?.alertasPendientes) || 0 },
    { name: "Completadas", value: Number(data?.alertasCompletadas) || 0 },
    { name: "Mejoradas", value: Number(data?.alertasMejoradas) || 0 },
    { name: "Sin seguimiento", value: Number(data?.alertasSinSeguimiento) || 0 },
  ];

  const color = "#60a5fa"; // azul claro legible

  return (
    <div className="bg-white p-4 rounded shadow col-span-4">
      <h3 className="font-semibold text-lg mb-2">Estados de las alertas</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          layout="vertical"
          data={estados}
          margin={{ left: 100, right: 50 }}
        >
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="name" />
          <Bar dataKey="value" fill={color}>
            <LabelList dataKey="name" position="right" fill="#374151" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
