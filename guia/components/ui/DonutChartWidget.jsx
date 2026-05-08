import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer} from "recharts";

const COLORS = ["#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow text-xs">
            <p className="font-semibold text-gray-700">{payload[0].name}</p>
            <p className="text-gray-500">Promedio: <span className="font-bold text-gray-700">{Number(payload[0].payload.promedio).toFixed(2)}</span></p>
            <p className="text-gray-500">Proporción: <span className="font-bold text-gray-700">{payload[0].value}%</span></p>
        </div>
    );
};

export default function DonutChartWidget({ title, data = [], nameKey, valueKey, loading = false }) {
    if (loading) return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="flex gap-4">
                <div className="w-40 h-40 rounded-full bg-gray-100 animate-pulse" />
                <div className="flex-1 space-y-2 pt-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );

    if (!data.length) return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            {title && <p className="text-sm font-bold text-gray-700 mb-3">{title}</p>}
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                Sin datos disponibles
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            {title && <p className="text-sm font-bold text-gray-700 mb-3">{title}</p>}

            <div className="flex gap-4 items-center">
                {/* Gráfico */}
                <div style={{ width: 160, height: 160, flexShrink: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={72}
                                dataKey={valueKey}
                                nameKey={nameKey}
                                paddingAngle={2}
                            >
                                {data.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Tabla lateral */}
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full text-xs">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-2 py-1.5 text-gray-500 font-semibold">Categoría</th>
                                <th className="text-right px-2 py-1.5 text-gray-500 font-semibold">Prom.</th>
                                <th className="text-right px-2 py-1.5 text-gray-500 font-semibold">%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => (
                                <tr key={i} className="border-b border-gray-100">
                                    <td className="px-2 py-1.5 flex items-center gap-1.5">
                                        <span
                                            className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                        />
                                        <span className="text-gray-700 leading-tight">{row[nameKey]}</span>
                                    </td>
                                    <td className="px-2 py-1.5 text-right font-semibold text-gray-700">
                                        {Number(row.promedio).toFixed(2)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right text-gray-500">
                                        {row[valueKey]}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}