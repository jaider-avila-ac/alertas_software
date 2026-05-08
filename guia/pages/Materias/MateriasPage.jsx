import { useState, useEffect } from "react";
import { Save, Loader2, RotateCcw, Pencil } from "lucide-react";
import { showToast } from "../../utils/notifications";
import DataTable from "../../components/ui/DataTable";
import {
  listarMaterias, crearMateria, actualizarMateria,
  listarGrados, obtenerMateriasDeGrado,
  asignarMateriasAGrado, desasignarMateriasDeGrado,
  listarCategorias,
} from "../../services/materias.service";

const COLUMNS = [
  { key: "nombre", label: "Materia", width: "50%" },
  { key: "_categoriaNombre", label: "Categoría", width: "50%" },
];
const FORM_VACIO = { nombre: "", categoriaId: "" };
const sortNombre = arr => [...arr].sort((a, b) => (a.nombre ?? "").localeCompare(b.nombre ?? ""));
const aplanar = arr => arr.map(m => ({ ...m, _categoriaNombre: m.categoria?.nombre ?? "—" }));

let _materiasCache = null; // { materias, grados, categorias }

export default function MateriasPage() {
  const [materias, setMaterias] = useState(_materiasCache?.materias ?? []);
  const [categorias, setCategorias] = useState(_materiasCache?.categorias ?? []);
  const [loadingTab, setLoadingTab] = useState(!_materiasCache);
  const [form, setForm] = useState(FORM_VACIO);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [grados, setGrados] = useState(_materiasCache?.grados ?? []);
  const [gradoId, setGradoId] = useState("");
  const [gradoNombre, setGradoNombre] = useState("");
  const [actualesIds, setActualesIds] = useState(new Set());
  const [marcadas, setMarcadas] = useState(new Set());
  const [loadingGrado, setLoadingGrado] = useState(false);
  const [savingMPG, setSavingMPG] = useState(false);
  const [msgMPG, setMsgMPG] = useState("");
  const [errMPG, setErrMPG] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([listarMaterias(), listarGrados(), listarCategorias()])
      .then(([m, g, c]) => {
        if (!active) return;
        const mats = aplanar(sortNombre(m));
        const grds = sortNombre(g);
        _materiasCache = { materias: mats, grados: grds, categorias: c };
        setMaterias(mats);
        setGrados(grds);
        setCategorias(c);
      })
      .finally(() => { if (active) setLoadingTab(false); });
    return () => { active = false; };
  }, []);

  const recargarMaterias = () =>
    listarMaterias().then(m => {
      const mats = aplanar(sortNombre(m));
      if (_materiasCache) _materiasCache = { ..._materiasCache, materias: mats };
      setMaterias(mats);
    });

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true); setFormError("");
    const payload = {
      nombre: form.nombre,
      ...(form.categoriaId ? { categoria: { id: parseInt(form.categoriaId) } } : {}),
    };
    try {
      editId ? await actualizarMateria(editId, payload) : await crearMateria(payload);
      setForm(FORM_VACIO); setEditId(null);
      await recargarMaterias();
    } catch (err) {
      setFormError(err?.response?.data?.message ?? err?.response?.data?.mensaje ?? "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleEditar = row => {
    setEditId(row.id);
    setForm({ nombre: row.nombre ?? "", categoriaId: row.categoria?.id?.toString() ?? "" });
    setFormError("");
  };
  const handleCancelarEdit = () => { setEditId(null); setForm(FORM_VACIO); setFormError(""); };

  const handleGradoChange = async e => {
    const id = e.target.value;
    const label = e.target.selectedOptions[0]?.textContent ?? "";
    setGradoId(id); setGradoNombre(label); setMsgMPG(""); setErrMPG("");
    if (!id) { setActualesIds(new Set()); setMarcadas(new Set()); return; }
    setLoadingGrado(true);
    try {
      const act = await obtenerMateriasDeGrado(id);
      const ids = new Set(act.map(m => m.id));
      setActualesIds(ids); setMarcadas(new Set(ids));
    } finally { setLoadingGrado(false); }
  };

  const toggleMateria = id => setMarcadas(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const handleResetMPG = () => { setMarcadas(new Set(actualesIds)); setMsgMPG(""); setErrMPG(""); };

  const handleGuardarMPG = async () => {
    if (!gradoId) return;
    setSavingMPG(true); setMsgMPG(""); setErrMPG("");
    const aAgregar = materias.filter(m => marcadas.has(m.id) && !actualesIds.has(m.id)).map(m => m.id);
    const aRemover = materias.filter(m => !marcadas.has(m.id) && actualesIds.has(m.id)).map(m => m.id);
    try {
      if (aAgregar.length) await asignarMateriasAGrado(gradoId, aAgregar);
      if (aRemover.length) await desasignarMateriasDeGrado(gradoId, aRemover);
      const act = await obtenerMateriasDeGrado(gradoId);
      const ids = new Set(act.map(m => m.id));
      setActualesIds(ids); setMarcadas(new Set(ids));
      setMsgMPG("Guardado correctamente.");
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.mensaje ?? "";
      if (msg.startsWith("TIENE_CALIFICACIONES:")) {
        const nombre = msg.split(":")[1];
        showToast(`"${nombre}" tiene calificaciones registradas y nunca puede quitarse del grado.`, "error");
        setErrMPG(`"${nombre}" no se puede quitar: tiene calificaciones.`);
      } else if (msg.startsWith("TIENE_ASIGNACIONES:")) {
        const nombre = msg.split(":")[1];
        showToast(`"${nombre}" tiene un docente asignado. Quita primero la asignación en la sección Asignaciones.`, "warning");
        setErrMPG(`"${nombre}" tiene docente asignado. Quita la asignación primero.`);
      } else {
        showToast(msg || "Error al guardar.", "error");
        setErrMPG(msg || "Error al guardar.");
      }
      // Revertir checkboxes al estado guardado para que no queden inconsistentes
      setMarcadas(new Set(actualesIds));
    } finally { setSavingMPG(false); }
  };

  const hayDiff = materias.some(m =>
    (marcadas.has(m.id) && !actualesIds.has(m.id)) ||
    (!marcadas.has(m.id) && actualesIds.has(m.id))
  );

  const renderAcciones = row => (
    <div className="flex items-center gap-2">
      <button onClick={() => handleEditar(row)}
        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors">
        <Pencil size={13} /> Editar
      </button>
    </div>
  );

  return (
    <div className="p-2">
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Columna formularios */}
        <div className="flex flex-col gap-4 w-full lg:w-1/2">

          {/* Formulario materia */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-sm">{editId ? "Editar materia" : "Nueva materia"}</h3>
              {editId && <button onClick={handleCancelarEdit} className="text-xs text-red-500 hover:text-red-700">Cancelar</button>}
            </div>
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
              {formError && <p className="text-xs text-red-500">{formError}</p>}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nombre</label>
                <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                  required placeholder="Ej: Matemáticas"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-300" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Categoría</label>
                <select value={form.categoriaId} onChange={e => setForm({ ...form, categoriaId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
                  <option value="">Sin categoría</option>
                  {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  {editId ? "Actualizar" : "Guardar"}
                </button>
                {editId && (
                  <button type="button" onClick={handleCancelarEdit}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Materias por grado */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm">Materias por grado</h3>
              <p className="text-xs text-gray-400 mt-0.5">Configura qué materias ve cada grado</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              <select value={gradoId} onChange={handleGradoChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
                <option value="">Seleccionar grado...</option>
                {grados.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>
              {gradoId && (loadingGrado ? (
                <div className="space-y-1.5">
                  {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />)}
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-500">Materias de <span className="font-semibold text-gray-700">{gradoNombre}</span>:</p>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto">
                    {materias.map(m => (
                      <label key={m.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-xs ${marcadas.has(m.id) ? "bg-cyan-50 border-cyan-300 text-cyan-700 font-medium" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
                        <input type="checkbox" checked={marcadas.has(m.id)} onChange={() => toggleMateria(m.id)} className="accent-cyan-500" />
                        {m.nombre}
                        {m.categoria?.nombre && <span className="text-[10px] text-gray-400 ml-auto">({m.categoria.nombre})</span>}
                      </label>
                    ))}
                  </div>
                  {msgMPG && <p className="text-xs text-emerald-600">{msgMPG}</p>}
                  {errMPG && <p className="text-xs text-red-500">{errMPG}</p>}
                  <div className="flex gap-2 pt-1">
                    <button onClick={handleGuardarMPG} disabled={savingMPG || !hayDiff}
                      className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
                      {savingMPG ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Guardar
                    </button>
                    <button onClick={handleResetMPG} disabled={savingMPG || !hayDiff}
                      className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
                      <RotateCcw size={13} /> Deshacer
                    </button>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Columna tabla */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full lg:w-1/2 h-120 lg:h-150">
          <div className="p-4 flex flex-col h-full">
            <DataTable
              columns={COLUMNS}
              rows={materias}
              actions={renderAcciones}
              loading={loadingTab}
              empty="No hay materias registradas."
              defaultSort={{ key: "nombre", dir: "asc" }}
              searchKeys={["nombre", "_categoriaNombre"]}
              pageSize={50}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
