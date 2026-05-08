import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Users, Save, Loader2, X } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import { useGradosYGrupos } from "./useGradosYGrupos";
import { get } from "../../services/api";

const COLUMNS_GRADOS = [{ key: "nombre", label: "Nombre del grado" }];
const COLUMNS_GRUPOS = [{ key: "nombre", label: "Nombre del grupo" }];

export default function GradosYGruposPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [anioActivo, setAnioActivo] = useState(null);

  const {
    grados, loadingGrados, gradoForm, editGradoId, savingGrado, errorGrado,
    gradoSeleccionado, grupos, loadingGrupos, grupoForm, editGrupoId, savingGrupo, errorGrupo,
    setGradoForm, handleSubmitGrado, handleEditarGrado, handleCancelarGrado, handleSeleccionarGrado,
    setGrupoForm, handleSubmitGrupo, handleEditarGrupo, handleCancelarGrupo,
  } = useGradosYGrupos();

  useEffect(() => {
    get("/anios/activo").then(r => setAnioActivo(r.data)).catch(() => {});
  }, []);

  const renderAccionesGrado = (row) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditarGrado(row)}
        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
      >
        <Pencil size={13} /> Editar
      </button>
      <button
        onClick={() => handleSeleccionarGrado(row)}
        className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
          gradoSeleccionado?.id === row.id
            ? "bg-cyan-100 text-cyan-700"
            : "bg-cyan-50 text-cyan-600 hover:bg-cyan-100"
        }`}
      >
        <Users size={13} /> Ver grupos
      </button>
    </div>
  );

  const renderAccionesGrupo = (row) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditarGrupo(row)}
        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
      >
        <Pencil size={13} /> Editar
      </button>
      <button
        onClick={() => navigate(
          `/${slug}/grados/${gradoSeleccionado?.id}/grupos/${row.id}/estudiantes`,
          { state: { grupo: row, grado: gradoSeleccionado, anio: anioActivo } }
        )}
        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors"
      >
        <Users size={13} /> Ver estudiantes
      </button>
    </div>
  );

  return (
    <div className="p-2">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">

        {/* COLUMNA IZQUIERDA - Grados */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Grados</h2>
            <p className="text-sm text-gray-400">Gestión de grados de la institución</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-sm">{editGradoId ? "Editar grado" : "Nuevo grado"}</h3>
              {editGradoId && (
                <button onClick={handleCancelarGrado} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                  <X size={13} /> Cancelar
                </button>
              )}
            </div>
            <form onSubmit={handleSubmitGrado} className="px-5 py-4 flex items-end gap-3">
              {errorGrado && <p className="text-xs text-red-500 absolute -mt-6">{errorGrado}</p>}
              <div className="flex-1 max-w-xs">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nombre del grado</label>
                <input
                  type="text" value={gradoForm.nombre}
                  onChange={e => setGradoForm({ nombre: e.target.value })}
                  required placeholder="Ej: Grado 10°"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <button type="submit" disabled={savingGrado}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
                {savingGrado ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {editGradoId ? "Actualizar" : "Guardar"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-100 lg:h-130">
            <div className="p-4 flex flex-col h-full">
              <DataTable
                columns={COLUMNS_GRADOS} rows={grados} actions={renderAccionesGrado}
                loading={loadingGrados} empty="No hay grados registrados."
                defaultSort={{ key: "nombre", dir: "asc" }} searchKeys={["nombre"]} pageSize={50}
              />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA - Grupos */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Grupos {gradoSeleccionado ? `— ${gradoSeleccionado.nombre}` : ""}
            </h2>
            <p className="text-sm text-gray-400">
              {gradoSeleccionado ? "Gestión de grupos del grado seleccionado" : "Selecciona un grado para ver sus grupos"}
            </p>
          </div>

          {gradoSeleccionado && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-sm">{editGrupoId ? "Editar grupo" : "Nuevo grupo"}</h3>
                {editGrupoId && (
                  <button onClick={handleCancelarGrupo} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                    <X size={13} /> Cancelar
                  </button>
                )}
              </div>
              <form onSubmit={handleSubmitGrupo} className="px-5 py-4 flex items-end gap-3">
                {errorGrupo && <p className="text-xs text-red-500 absolute -mt-6">{errorGrupo}</p>}
                <div className="flex-1 max-w-xs">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nombre del grupo</label>
                  <input
                    type="text" value={grupoForm.nombre}
                    onChange={e => setGrupoForm({ nombre: e.target.value })}
                    required placeholder="Ej: Grupo A"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <button type="submit" disabled={savingGrupo}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
                  {savingGrupo ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {editGrupoId ? "Actualizar" : "Guardar"}
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-100 lg:h-130">
            <div className="p-4 flex flex-col h-full">
              {!gradoSeleccionado ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Selecciona un grado para ver sus grupos
                </div>
              ) : (
                <DataTable
                  columns={COLUMNS_GRUPOS} rows={grupos} actions={renderAccionesGrupo}
                  loading={loadingGrupos} empty="No hay grupos registrados para este grado."
                  defaultSort={{ key: "nombre", dir: "asc" }} searchKeys={["nombre"]} pageSize={50}
                />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}