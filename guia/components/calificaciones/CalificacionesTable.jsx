import { useState } from "react";
import { Save, Loader2, Lock, CheckCircle2, ChevronDown } from "lucide-react";
import { useCalificaciones } from "../../pages/Docentes/hooks/useCalificaciones";

const fmt = (n) => {
  if (n === null || n === undefined || n === "") return "—";
  const x = Number(n);
  return isNaN(x) ? "—" : x.toFixed(1);
};

const colorNota = (n) => {
  if (n === null || n === undefined || n === "") return "text-gray-400";
  return Number(n) >= 3 ? "text-green-600 font-bold" : "text-red-500 font-bold";
};

function NotaInput({ estudianteId, cfg, corte, getValorActual, handleInputChange, guardarValor }) {
  return (
    <input
      type="number"
      step="0.1"
      min="0"
      max="5"
      value={getValorActual(estudianteId, cfg.id, corte)}
      onChange={e => handleInputChange(estudianteId, cfg.id, corte, e.target.value)}
      onBlur={e => guardarValor(estudianteId, cfg.id, corte, e.target.value)}
      className="w-16 text-center border border-gray-200 rounded-lg px-1 py-1.5 text-sm focus:ring-2 focus:ring-cyan-400 outline-none hover:border-cyan-300 transition-colors"
    />
  );
}

export default function CalificacionesTable({
  configNotas,
  estudiantes,
  valoresIniciales,
  asignacionId,
  anioId,
  loading,
}) {
  const {
    notasPorCorte,
    cortesOrdenados,
    getValorActual,
    promedios,
    handleInputChange,
    guardarValor,
    guardarTodas,
    hasChanges,
    saving,
    editsCount,
    esCortecompleto,
    esCorteBloqueado,
    calcularPromedioCorte,
  } = useCalificaciones({ configNotas, estudiantes, valoresIniciales, asignacionId, anioId });

  const [corteActivo, setCorteActivo] = useState(null);
  const [estudianteAbierto, setEstudianteAbierto] = useState(null);
  const corte = corteActivo ?? cortesOrdenados[0] ?? null;

  const cambiarCorte = (c) => { setCorteActivo(c); setEstudianteAbierto(null); };
  const toggleEstudiante = (id) => setEstudianteAbierto(prev => prev === id ? null : id);

  if (configNotas.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400">
        No hay configuración de notas para este año académico.
      </div>
    );
  }

  const notasDelCorte  = corte ? (notasPorCorte[corte] || []) : [];
  const estaBloqueado  = corte ? esCorteBloqueado(corte)  : false;
  const estaCompleto   = corte ? esCortecompleto(corte)   : false;
  const idxCorteActivo = cortesOrdenados.indexOf(corte);
  const siguienteCorte = idxCorteActivo < cortesOrdenados.length - 1
    ? cortesOrdenados[idxCorteActivo + 1]
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      {/* ── Pestañas por corte ── */}
      <div className="flex border-b border-gray-200 overflow-x-auto shrink-0">
        {cortesOrdenados.map(c => {
          const esActivo    = c === corte;
          const esBloqueado = esCorteBloqueado(c);
          const esCompleto  = esCortecompleto(c);
          return (
            <button
              key={c}
              disabled={esBloqueado}
              onClick={() => cambiarCorte(c)}
              title={esBloqueado
                ? `Completa el Corte ${cortesOrdenados[cortesOrdenados.indexOf(c) - 1]} primero`
                : undefined}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${esActivo
                  ? "border-cyan-500 text-cyan-600 bg-cyan-50/60"
                  : esBloqueado
                  ? "border-transparent text-gray-300 cursor-not-allowed"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              {esBloqueado
                ? <Lock size={12} className="text-gray-300" />
                : esCompleto
                ? <CheckCircle2 size={13} className="text-green-500" />
                : null}
              Corte {c}
            </button>
          );
        })}
      </div>

      {/* ── Aviso corte bloqueado ── */}
      {estaBloqueado && (
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 text-amber-700 text-sm flex items-center gap-2">
          <Lock size={14} />
          Debes completar y guardar el corte anterior para habilitar este.
        </div>
      )}

      {/* ── Aviso corte completo ── */}
      {!estaBloqueado && estaCompleto && !hasChanges && siguienteCorte && (
        <div className="px-4 py-3 bg-green-50 border-b border-green-100 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle2 size={14} />
          Corte {corte} completado.
          <button
            onClick={() => cambiarCorte(siguienteCorte)}
            className="ml-1 underline font-semibold"
          >
            Ir al Corte {siguienteCorte} →
          </button>
        </div>
      )}

      {/* ── Tabla desktop (md+) ── */}
      {!estaBloqueado && corte && (
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Estudiante
                </th>
                {notasDelCorte.map(cfg => (
                  <th key={cfg.id} className="py-3 px-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {cfg.nombre}
                    <div className="text-gray-400 font-normal normal-case">{cfg.porcentaje}%</div>
                  </th>
                ))}
                <th className="py-3 px-4 text-center text-xs font-semibold text-cyan-600 uppercase tracking-wide">
                  Corte {corte}
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {estudiantes.map(est => {
                const promCorte = calcularPromedioCorte(est.id, corte);
                const promTotal = promedios.get(est.id) ?? null;
                return (
                  <tr key={est.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-gray-800">
                        {est.nombres} {est.apellidos}
                      </div>
                      <div className="text-xs text-gray-400">{est.documento}</div>
                    </td>
                    {notasDelCorte.map(cfg => (
                      <td key={cfg.id} className="py-2 px-3 text-center">
                        <NotaInput
                          estudianteId={est.id}
                          cfg={cfg}
                          corte={corte}
                          getValorActual={getValorActual}
                          handleInputChange={handleInputChange}
                          guardarValor={guardarValor}
                        />
                      </td>
                    ))}
                    <td className={`py-3 px-4 text-center text-sm ${colorNota(promCorte)}`}>
                      {fmt(promCorte)}
                    </td>
                    <td className={`py-3 px-4 text-center text-sm ${colorNota(promTotal)}`}>
                      {fmt(promTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Cards mobile (<md) — acordeón ── */}
      {!estaBloqueado && corte && (
        <div className="md:hidden divide-y divide-gray-100">
          {estudiantes.map(est => {
            const abierto   = estudianteAbierto === est.id;
            const promCorte = calcularPromedioCorte(est.id, corte);
            const promTotal = promedios.get(est.id) ?? null;
            return (
              <div key={est.id} className="divide-y divide-gray-100">

                {/* Cabecera — siempre visible, click para abrir/cerrar */}
                <button
                  type="button"
                  onClick={() => toggleEstudiante(est.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {est.nombres} {est.apellidos}
                    </p>
                    <p className="text-xs text-gray-400">{est.documento}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className={`text-sm ${colorNota(promTotal)}`}>{fmt(promTotal)}</p>
                      <p className="text-xs text-gray-400">total</p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {/* Cuerpo — solo visible cuando está abierto */}
                {abierto && (
                  <div className="px-4 py-3 bg-gray-50 space-y-3">
                    <div className="space-y-2">
                      {notasDelCorte.map(cfg => (
                        <div key={cfg.id} className="flex items-center gap-3">
                          <span className="text-xs text-gray-600 flex-1 leading-tight">
                            {cfg.nombre}
                            <span className="text-gray-400 ml-1">({cfg.porcentaje}%)</span>
                          </span>
                          <NotaInput
                            estudianteId={est.id}
                            cfg={cfg}
                            corte={corte}
                            getValorActual={getValorActual}
                            handleInputChange={handleInputChange}
                            guardarValor={guardarValor}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-200">
                      <span className="text-xs text-gray-400">Corte {corte}:</span>
                      <span className={`text-xs ${colorNota(promCorte)}`}>{fmt(promCorte)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Footer: guardar ── */}
      <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between gap-3">
        <span className="text-xs text-amber-600 font-medium">
          {hasChanges ? `${editsCount} cambio${editsCount !== 1 ? "s" : ""} sin guardar` : ""}
        </span>
        <button
          onClick={guardarTodas}
          disabled={!hasChanges || saving || loading}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold px-5 py-2 rounded-xl disabled:opacity-50 transition-all"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Guardar
        </button>
      </div>
    </div>
  );
}
