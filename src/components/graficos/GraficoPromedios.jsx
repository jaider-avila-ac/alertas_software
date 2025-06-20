import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList, Cell } from "recharts";

export const GraficoPromedios = ({ data }) => {
  const promedios = [
    { name: "Por mes", value: Number(data?.promedioPorMes) || 0 },
    { name: "Por estudiante", value: Number(data?.promedioPorEstudiante) || 0 },
  ];

  const colores = ["#10b981", "#6366f1"];

  return (
    <div className="bg-white p-4 rounded shadow col-span-4">
      <h3 className="font-semibold text-lg mb-2">Promedios</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          layout="vertical"
          data={promedios}
          margin={{ left: 100, right: 20 }}
        >
          <XAxis type="number" allowDecimals />
          <YAxis type="category" dataKey="name" />
          <Bar dataKey="value">
            <LabelList dataKey="name" position="insideLeft" fill="#fff" />
            {promedios.map((_, i) => (
              <Cell key={i} fill={colores[i % colores.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
