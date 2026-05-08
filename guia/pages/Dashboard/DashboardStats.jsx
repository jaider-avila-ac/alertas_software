import { useState, useEffect } from "react";
import { GraduationCap, Trophy, Medal } from "lucide-react";
import DonutChartWidget from "../../components/ui/DonutChartWidget";
import { getDashboardCategorias, getDashboardTop1PorGrado } from "../../services/dashboard.service";

let _cache = null; // { categorias, top1 }

function puestoIcon(i) {
  if (i === 0) return <Trophy size={13} className="text-amber-400 shrink-0" />;
  if (i === 1) return <Medal  size={13} className="text-gray-400 shrink-0" />;
  if (i === 2) return <Medal  size={13} className="text-orange-400 shrink-0" />;
  return <GraduationCap size={13} className="text-gray-300 shrink-0" />;
}

export default function DashboardStats({ anioId }) {
  const [categorias, setCategorias] = useState(_cache?.categorias ?? []);
  const [top1,       setTop1]       = useState(_cache?.top1       ?? []);
  const [loading,    setLoading]    = useState(!_cache);

  useEffect(() => {
    if (!anioId) return;
    let active = true;

    Promise.all([
      getDashboardCategorias(anioId),
      getDashboardTop1PorGrado(anioId),
    ])
      .then(([cats, top]) => {
        if (!active) return;
        _cache = { categorias: cats, top1: top };
        setCategorias(cats);
        setTop1(top);
      })
      .catch((err) => { console.error("[DashboardStats] error fetching stats:", err?.response?.status, err?.response?.data ?? err?.message); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [anioId]);

  if (!anioId) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">

      {/* Donut: rendimiento por categoría */}
      <DonutChartWidget
        title="Rendimiento por categoría de materias"
        data={categorias}
        nameKey="categoriaNombre"
        valueKey="porcentaje"
        loading={loading && categorias.length === 0}
      />

      {/* Top 1 por grado */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <p className="text-sm font-bold text-gray-700 mb-3">Mejor estudiante por grado</p>

        {loading && top1.length === 0 ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : top1.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            Sin datos disponibles
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto max-h-52">
            {top1.map((row, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                {puestoIcon(i)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {row.nombres} {row.apellidos}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {row.gradoNombre} · {row.grupoNombre}
                  </p>
                </div>
                <span className="text-sm font-bold text-cyan-600 shrink-0">
                  {Number(row.promedio).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
