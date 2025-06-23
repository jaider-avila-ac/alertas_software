import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const GraficoConsultasPorMes = ({ data }) => {

  const datos = Object.entries(data?.consultasPorMes || {}).map(([mes, valor]) => ({
    name: mes,
    value: valor,
  }));

  return (
    <div className="bg-white p-4 rounded shadow col-span-12">
      <h3 className="font-semibold text-lg mb-2">Alertas por Mes</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
