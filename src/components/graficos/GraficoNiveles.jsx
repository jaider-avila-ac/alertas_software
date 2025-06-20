import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#c084fc", "#f826a9", "#fbbf24", "#34d399"];

export const GraficoNiveles = ({ data }) => {
  const niveles = [
    { name: "Crítico", value: data?.alertasCritico || 0 },
    { name: "Alto", value: data?.alertasAlto || 0 },
    { name: "Moderado", value: data?.alertasModerado || 0 },
    { name: "Leve", value: data?.alertasLeve || 0 },
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
