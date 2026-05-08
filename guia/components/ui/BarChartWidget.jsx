import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const COLORS = ["#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function BarChartWidget({ title, data = [], dataKey, nameKey, height = 220, loading = false }) {
    if (loading) return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
        </div>
    );

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            {title && <p className="text-sm font-bold text-gray-700 mb-3">{title}</p>}
            {data.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                    Sin datos disponibles
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey={nameKey}
                            tick={{ fontSize: 11, fill: "#6b7280" }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            domain={[0, 5]}
                            tick={{ fontSize: 11, fill: "#6b7280" }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            formatter={(v) => [Number(v).toFixed(2), "Promedio"]}
                            contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                        />
                        <Bar dataKey={dataKey} radius={[6, 6, 0, 0]}>
                            {data.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}