import { Loader2, UserPlus, UserMinus, Search, X } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import { useMatriculas } from "./useMatriculas";

const COLUMNS_MATRICULADOS = [
  { key: "nombre",    label: "Nombre" },
  { key: "documento", label: "Documento",  sortable: false },
  { key: "anio",      label: "Año",        sortable: false },
  { key: "grado",     label: "Grado" },
  { key: "grupo",     label: "Grupo",      sortable: false },
];

export default function MatriculasPage() {
  const {
    sinMatriculaFiltrados, anioActivo, grados, grupos, matriculados,
    loadingInit, loadingGrupos, saving, retirando,
    estudianteSeleccionado, gradoId, grupoId, formError, successMsg,
    query, setQuery,
    seleccionar, handleGradoChange, setGrupoId,
    handleMatricular, handleRetirar,
  } = useMatriculas();

  const canSubmit = estudianteSeleccionado && anioActivo && gradoId && grupoId;

  const renderAcciones = row => (
    <button
      onClick={() => handleRetirar(row.id)}
      disabled={retirando[row.id]}
      title="Retirar matrícula (el estudiante vuelve a la lista de sin matrícula y sus notas se conservan)"
      className="relative group flex items-center justify-center p-1.5 rounded-lg bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors disabled:opacity-50"
    >
      {retirando[row.id]
        ? <Loader2 size={14} className="animate-spin" />
        : <UserMinus size={14} />}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
        Retirar
      </span>
    </button>
  );

  return (
    <div className="p-2 space-y-4">

      {/* Fila superior */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* FORMULARIO */}
        <div className="w-full lg:flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-auto lg:h-115">

          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm">Formulario de matrícula</h3>
          </div>

          <div className="px-6 py-5 space-y-4">

            {formError  && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>}
            {successMsg && <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{successMsg}</p>}

            {/* Estudiante */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Estudiante</label>
              <div className={`w-full border rounded-lg px-3 py-2 text-sm ${
                estudianteSeleccionado ? "border-cyan-300 bg-cyan-50 text-cyan-700 font-medium" : "border-gray-200 bg-gray-50 text-gray-400"
              }`}>
                {estudianteSeleccionado
                  ? `${estudianteSeleccionado.nombres} ${estudianteSeleccionado.apellidos} — ${estudianteSeleccionado.documento}`
                  : "Selecciona un estudiante del panel derecho"}
              </div>
            </div>

            {/* Año */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Año académico</label>
              <div className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600">
                {loadingInit ? "Cargando..." : (anioActivo?.anio ?? "No hay año activo")}
              </div>
            </div>

            {/* Grado */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Grado</label>
              <select
                value={gradoId}
                onChange={e => handleGradoChange(e.target.value)}
                disabled={!estudianteSeleccionado}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Seleccionar grado...</option>
                {grados.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>
            </div>

            {/* Grupo */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Grupo</label>
              <select
                value={grupoId}
                onChange={e => setGrupoId(e.target.value)}
                disabled={!gradoId || loadingGrupos}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">
                  {loadingGrupos ? "Cargando..." : "Seleccionar grupo..."}
                </option>
                {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>
            </div>

            {/* Botón */}
            <div className="pt-2">
              <button
                onClick={handleMatricular}
                disabled={!canSubmit || saving}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-50"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
                Matricular
              </button>
            </div>

          </div>
        </div>

        {/* PANEL SIN MATRÍCULA */}
        <div className="w-full lg:flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-115">

          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm">Sin matrícula</h3>
            <p className="text-xs text-gray-400 mt-0.5">Selecciona un estudiante</p>
          </div>

          {/* Búsqueda */}
          <div className="px-3 pt-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-8 pr-7 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loadingInit ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))
            ) : sinMatriculaFiltrados.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">
                {query ? "Sin resultados." : "Todos matriculados."}
              </p>
            ) : (
              sinMatriculaFiltrados.map(est => (
                <div
                  key={est.id}
                  onClick={() => seleccionar(est)}
                  className={`px-3 py-2.5 rounded-xl border cursor-pointer ${
                    estudianteSeleccionado?.id === est.id
                      ? "bg-cyan-50 border-cyan-300"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <p className="text-xs font-semibold">{est.nombres} {est.apellidos}</p>
                  <p className="text-xs text-gray-400">{est.documento}</p>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-120 lg:h-130">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm">Estudiantes matriculados</h3>
        </div>
        <div className="p-4 flex flex-col h-[calc(100%-57px)]">
          <DataTable
            columns={COLUMNS_MATRICULADOS}
            rows={matriculados}
            actions={renderAcciones}
            loading={loadingInit}
            empty="No hay estudiantes matriculados."
            defaultSort={{ key: "nombre", dir: "asc" }}
            searchKeys={["nombre", "documento", "grado"]}
            pageSize={50}
          />
        </div>
      </div>

    </div>
  );
}
