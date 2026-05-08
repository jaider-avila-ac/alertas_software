import { Plus, CheckCircle, XCircle, Loader2, Save, AlertTriangle } from "lucide-react";
import { useAnioAcademico } from "./useAnioAcademico";

export default function AnioAcademicoPage() {
  const {
    anios, loadingAnios, nuevoAnio, setNuevoAnio, creando, activando, cerrando,
    handleCrearAnio, handleActivar, handleCerrar,
    activoId, activoNombre, numCortes, setNumCortes,
    numNotas, plantilla, loadingCfg, savingCfg, msgCfg, errCfg,
    handleNumNotasChange, handlePlantillaChange, handleGuardarCfg,
  } = useAnioAcademico();

  return (
    <div className="p-2">

      {/* Banner: sin año activo */}
      {!loadingCfg && !activoId && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700">
            No hay un año académico activo. Crea uno o activa un año existente para poder registrar datos.
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 items-start">

        {/* ── Columna izquierda: años ── */}
        <div className="flex flex-col gap-4 w-full lg:w-85 lg:shrink-0">

          {/* Nuevo año */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm">Nuevo año académico</h3>
            </div>
            <form onSubmit={handleCrearAnio} className="px-5 py-4 flex gap-2">
              <input
                type="number"
                value={nuevoAnio}
                onChange={e => setNuevoAnio(e.target.value)}
                placeholder="Ej: 2025"
                required
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-300"
              />
              <button
                type="submit"
                disabled={creando}
                className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                {creando ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                Crear
              </button>
            </form>
          </div>

          {/* Tabla de años */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm">Años registrados</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-cyan-500 text-white">
                    <th className="text-center px-4 py-3 font-semibold">Año</th>
                    <th className="text-center px-4 py-3 font-semibold">Estado</th>
                    <th className="text-center px-4 py-3 font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingAnios ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                        {[1, 2, 3].map(j => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto" style={{ width: "60%" }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : anios.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-gray-400">
                        Sin años registrados.
                      </td>
                    </tr>
                  ) : (
                    anios.map((a, i) => {
                      const activo = a.estado === "ACTIVO";
                      return (
                        <tr key={a.id}
                          className={`border-t border-gray-200 ${i % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
                          <td className="px-4 py-3 text-center font-semibold text-gray-800">{a.anio}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              activo ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                            }`}>
                              {a.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {activo ? (
                              <button
                                onClick={() => handleCerrar(a.id)}
                                disabled={cerrando === a.id}
                                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50 mx-auto"
                              >
                                {cerrando === a.id
                                  ? <Loader2 size={12} className="animate-spin" />
                                  : <XCircle size={12} />
                                }
                                Cerrar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivar(a.id)}
                                disabled={activando === a.id}
                                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors disabled:opacity-50 mx-auto"
                              >
                                {activando === a.id
                                  ? <Loader2 size={12} className="animate-spin" />
                                  : <CheckCircle size={12} />
                                }
                                Activar
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Columna derecha: configuración ── */}
        <div className="w-full lg:flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm">Configuración evaluativa</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Año activo: <span className="font-semibold text-cyan-600">{activoNombre}</span>
            </p>
          </div>

          {loadingCfg ? (
            <div className="px-6 py-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !activoId ? (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">
              Activa un año académico para configurarlo.
            </div>
          ) : (
            <div className="px-4 sm:px-6 py-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    Número de cortes
                  </label>
                  <input
                    type="number" min="1" value={numCortes}
                    onChange={e => setNumCortes(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    Notas por corte
                  </label>
                  <input
                    type="number" min="1" value={numNotas}
                    onChange={e => handleNumNotasChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Plantilla de notas (aplica a todos los cortes)
                </p>
                <div className="rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-cyan-500 text-white">
                        <th className="text-left px-4 py-2.5 font-semibold">Nombre</th>
                        <th className="text-left px-4 py-2.5 font-semibold">Porcentaje (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plantilla.map((n, i) => (
                        <tr key={i}
                          className={`border-t border-gray-200 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                          <td className="px-4 py-2">
                            <input
                              type="text" value={n.nombre}
                              onChange={e => handlePlantillaChange(i, "nombre", e.target.value)}
                              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number" min="0" step="0.01" value={n.porcentaje}
                              onChange={e => handlePlantillaChange(i, "porcentaje", e.target.value)}
                              className="w-full sm:w-32 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {msgCfg && <p className="text-sm text-emerald-600">{msgCfg}</p>}
              {errCfg && <p className="text-sm text-red-500">{errCfg}</p>}

              <div className="pt-2">
                <button
                  onClick={handleGuardarCfg}
                  disabled={savingCfg}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {savingCfg ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  Guardar configuración
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
