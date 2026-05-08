import { useState, useEffect } from "react";
import { Loader2, Save, Pencil, X, UserMinus } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import { showToast } from "../../utils/notifications";
import {
    crearAsignacion, listarPorGrupo, cambiarDocente, quitarDocente,
    listarGrados, listarGruposPorGrado, listarDocentes, obtenerMateriasDeGrado,
} from "../../services/asignaciones.service";

const sortNombre = arr => [...arr].sort((a, b) =>
    (a.nombre ?? a.nombres ?? "").localeCompare(b.nombre ?? b.nombres ?? "")
);

const COLUMNS = [
    { key: "materiaNombre", label: "Materia", width: "40%" },
    {
        key: "docenteNombre", label: "Docente", width: "40%",
        render: v => v
            ? v
            : <span className="text-xs text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded-full">Sin docente</span>,
    },
];

const FORM_INIT = { gradoId: "", grupoId: "", materiaId: "", docenteId: "" };

let _asignacionesCache = null; // { grados, docentes }

export default function AsignacionesPage() {

    const [grados, setGrados] = useState(_asignacionesCache?.grados ?? []);
    const [grupos, setGrupos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [docentes, setDocentes] = useState(_asignacionesCache?.docentes ?? []);

    const [asignaciones, setAsignaciones] = useState([]);
    const [loadingInit, setLoadingInit] = useState(!_asignacionesCache);
    const [loadingGrupos, setLoadingGrupos] = useState(false);
    const [loadingTabla, setLoadingTabla] = useState(false);

    const [form, setForm] = useState(FORM_INIT);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [gradoNombre, setGradoNombre] = useState("");
    const [grupoNombre, setGrupoNombre] = useState("");

    const [editando, setEditando] = useState(null);
    const [savingEdit, setSavingEdit] = useState(false);
    const [editError, setEditError] = useState("");
    const [quitando, setQuitando] = useState(false);

    useEffect(() => {
        let active = true;
        Promise.all([listarGrados(), listarDocentes()])
            .then(([grds, docs]) => {
                if (!active) return;
                const sortedGrados = sortNombre(grds);
                const sortedDocentes = docs.map(d => ({
                    ...d,
                    nombre: `${d.nombres ?? ""} ${d.apellidos ?? ""}`.trim(),
                })).sort((a, b) => a.nombre.localeCompare(b.nombre));
                _asignacionesCache = { grados: sortedGrados, docentes: sortedDocentes };
                setGrados(sortedGrados);
                setDocentes(sortedDocentes);
            })
            .finally(() => { if (active) setLoadingInit(false); });
        return () => { active = false; };
    }, []);

    const handleGradoChange = async (e) => {
        const id = e.target.value;
        const label = e.target.selectedOptions[0]?.textContent ?? "";
        setForm(prev => ({ ...prev, gradoId: id, grupoId: "", materiaId: "" }));
        setGradoNombre(label); setGrupoNombre("");
        setGrupos([]); setMaterias([]); setAsignaciones([]);
        if (!id) return;
        setLoadingGrupos(true);
        try {
            const [grps, mats] = await Promise.all([
                listarGruposPorGrado(id),
                obtenerMateriasDeGrado(id),
            ]);
            setGrupos(sortNombre(grps));
            setMaterias(sortNombre(mats));
        } finally { setLoadingGrupos(false); }
    };

    const handleGrupoChange = async (e) => {
        const id = e.target.value;
        const label = e.target.selectedOptions[0]?.textContent ?? "";
        setForm(prev => ({ ...prev, grupoId: id, materiaId: "" }));
        setGrupoNombre(label); setAsignaciones([]);
        if (!id) return;
        setLoadingTabla(true);
        try {
            const data = await listarPorGrupo(id);
            setAsignaciones(data ?? []);
        } finally { setLoadingTabla(false); }
    };

    const handleSelect = (field) => (e) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const recargarTabla = async () => {
        if (!form.grupoId) return;
        const data = await listarPorGrupo(form.grupoId);
        setAsignaciones(data ?? []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { grupoId, materiaId, docenteId } = form;
        if (!grupoId || !materiaId || !docenteId) {
            setFormError("Completa todos los campos."); return;
        }
        setSaving(true); setFormError(""); setSuccessMsg("");
        try {
            await crearAsignacion({ grupoId: Number(grupoId), materiaId: Number(materiaId), docenteId: Number(docenteId) });
            setForm(prev => ({ ...prev, materiaId: "", docenteId: "" }));
            setSuccessMsg("Asignación creada.");
            setTimeout(() => setSuccessMsg(""), 3000);
            await recargarTabla();
        } catch (err) {
            setFormError(err?.response?.data?.message ?? err?.response?.data ?? "Error al asignar.");
        } finally { setSaving(false); }
    };

    const handleQuitarDocente = async () => {
        if (!editando) return;
        setQuitando(true); setEditError("");
        try {
            await quitarDocente(editando.id);
            setEditando(null);
            await recargarTabla();
            showToast("Docente quitado. Las calificaciones se conservan.", "info");
        } catch (err) {
            setEditError(err?.response?.data?.mensaje ?? err?.response?.data?.message ?? "Error al quitar docente.");
        } finally { setQuitando(false); }
    };

    const handleGuardarDocente = async () => {
        if (!editando?.docenteId) { setEditError("Selecciona un docente."); return; }
        setSavingEdit(true); setEditError("");
        try {
            await cambiarDocente(editando.id, Number(editando.docenteId));
            setEditando(null);
            await recargarTabla();
        } catch (err) {
            setEditError(err?.response?.data?.mensaje ?? err?.response?.data?.message ?? "Error al cambiar.");
        } finally { setSavingEdit(false); }
    };

    const renderAcciones = row => (
        <button
            onClick={() => { setEditando({ id: row.id, docenteId: String(row.docenteId ?? ""), materiaNombre: row.materiaNombre, tieneDocente: !!row.docenteId }); setEditError(""); }}
            className={`relative group flex items-center justify-center p-1.5 rounded-lg transition-colors ${
                editando?.id === row.id
                    ? "bg-amber-200 text-amber-700"
                    : "bg-amber-50 text-amber-600 hover:bg-amber-100"
            }`}
        >
            <Pencil size={14} />
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {row.docenteId ? "Cambiar docente" : "Asignar docente"}
            </span>
        </button>
    );

    const materiasAsignadasIds = new Set(asignaciones.map(a => a.materiaId));
    const materiasDisponibles = materias.filter(m => !materiasAsignadasIds.has(m.id));

    const infoSeleccion = [gradoNombre, grupoNombre].filter(Boolean).join(" · ");

    return (
        <div className="p-2">
            <div className="flex flex-col lg:flex-row gap-4 items-start">

                {/* Formulario */}
                <div className="w-full lg:w-75 lg:shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800 text-sm">
                                {editando ? "Cambiar docente" : "Asignar docente a materia"}
                            </h3>
                        </div>

                        {editando ? (
                            /* ── Modo edición ── */
                            <div className="px-5 py-4 space-y-3">
                                {editError && <p className="text-xs text-red-500">{editError}</p>}

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Materia</label>
                                    <div className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500">
                                        {editando.materiaNombre}
                                    </div>
                                </div>

                                <SelectField label="Nuevo docente" value={editando.docenteId}
                                    onChange={e => setEditando(prev => ({ ...prev, docenteId: e.target.value }))}>
                                    <option value="">Seleccionar docente...</option>
                                    {docentes.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                                </SelectField>

                                <div className="flex gap-2 pt-1">
                                    <button
                                        onClick={handleGuardarDocente}
                                        disabled={savingEdit || quitando || !editando.docenteId}
                                        className="flex items-center gap-1.5 flex-1 justify-center bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        {savingEdit ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                                        Guardar
                                    </button>
                                    <button
                                        onClick={() => { setEditando(null); setEditError(""); }}
                                        disabled={savingEdit || quitando}
                                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 text-xs font-semibold transition-colors disabled:opacity-50"
                                    >
                                        <X size={13} />
                                        Cancelar
                                    </button>
                                </div>
                                {editando.tieneDocente && (
                                    <button
                                        onClick={handleQuitarDocente}
                                        disabled={savingEdit || quitando}
                                        className="flex items-center gap-1.5 w-full justify-center mt-1 px-4 py-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs font-semibold transition-colors disabled:opacity-50 border border-orange-200"
                                    >
                                        {quitando ? <Loader2 size={13} className="animate-spin" /> : <UserMinus size={13} />}
                                        Quitar docente (conserva notas)
                                    </button>
                                )}
                            </div>
                        ) : (
                            /* ── Modo creación ── */
                            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
                                {formError && <p className="text-xs text-red-500">{formError}</p>}
                                {successMsg && <p className="text-xs text-emerald-600">{successMsg}</p>}

                                <SelectField label="Grado" value={form.gradoId} onChange={handleGradoChange} disabled={loadingInit}>
                                    <option value="">Seleccionar grado...</option>
                                    {grados.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                                </SelectField>

                                <SelectField label="Grupo" value={form.grupoId} onChange={handleGrupoChange}
                                    disabled={!form.gradoId || loadingGrupos}>
                                    <option value="">{loadingGrupos ? "Cargando..." : "Seleccionar grupo..."}</option>
                                    {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                                </SelectField>

                                <SelectField label="Materia" value={form.materiaId} onChange={handleSelect("materiaId")}
                                    disabled={!form.grupoId || materiasDisponibles.length === 0}>
                                    <option value="">
                                        {!form.grupoId
                                            ? "Seleccionar materia..."
                                            : materiasDisponibles.length === 0
                                                ? "Todas asignadas"
                                                : "Seleccionar materia..."}
                                    </option>
                                    {materiasDisponibles.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                </SelectField>

                                <SelectField label="Docente" value={form.docenteId} onChange={handleSelect("docenteId")}
                                    disabled={!form.grupoId}>
                                    <option value="">Seleccionar docente...</option>
                                    {docentes.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                                </SelectField>

                                <button type="submit"
                                    disabled={saving || !form.grupoId || !form.materiaId || !form.docenteId}
                                    className="flex items-center gap-1.5 w-full justify-center bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                                    Asignar
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Tabla */}
                <div className="w-full lg:flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm h-120 lg:h-155">
                    <div className="px-5 py-4 border-b border-gray-100 shrink-0">
                        <h3 className="font-bold text-gray-800 text-sm">
                            Asignaciones realizadas
                            {infoSeleccion && <span className="text-gray-400 font-normal ml-2">— {infoSeleccion}</span>}
                        </h3>
                    </div>
                    <div className="p-4 flex flex-col h-[calc(100%-57px)]">
                        {!form.grupoId ? (
                            <div className="flex-1 flex items-center justify-center text-sm text-gray-400 text-center px-4">
                                Selecciona un grado y grupo para ver las asignaciones.
                            </div>
                        ) : (
                            <DataTable
                                columns={COLUMNS}
                                rows={asignaciones}
                                actions={renderAcciones}
                                loading={loadingTabla}
                                empty="No hay asignaciones para este grupo."
                                defaultSort={{ key: "materiaNombre", dir: "asc" }}
                                searchKeys={["materiaNombre", "docenteNombre"]}
                                pageSize={50}
                            />
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

function SelectField({ label, value, onChange, disabled, children }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{label}</label>
            <select value={value} onChange={onChange} disabled={disabled}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white disabled:bg-gray-50 disabled:text-gray-400">
                {children}
            </select>
        </div>
    );
}
