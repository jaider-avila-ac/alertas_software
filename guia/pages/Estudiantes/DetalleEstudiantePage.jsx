import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Lock, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
    getResumen, getEstudiante, getMaterias, getNotasMateria, getAnioActivo,
    recalcularEstadisticas,
} from "../../services/notas.service";
import { get } from "../../services/api";

const fmt = (n, d = 2) => (n === null || n === undefined) ? "—" : Number(n).toFixed(d);

let _detalleCache = {}; // keyed by student rawId

export default function DetalleEstudiantePage() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { id: rawId } = useParams();
    const { state } = useLocation();
    const { perfil, loadingPerfil } = useAuth();
    const rol = perfil?.rol?.toUpperCase();

    const esEstudiante = rol === "ESTUDIANTE";
    const esDocente = rol === "DOCENTE";
    const esAdmin = rol === "ADMIN_INSTITUCION" || rol === "SECRETARIO" || rol === "ADMIN";

    const id = rawId ?? (esEstudiante && perfil?.personaId ? String(perfil.personaId) : null);
    const esMiPerfil = esEstudiante && perfil?.personaId != null && perfil.personaId === Number(id);

    const accesoNegado = !loadingPerfil && perfil != null && esEstudiante && !esMiPerfil;

    const cached = rawId ? (_detalleCache[rawId] ?? null) : null;

    const [grupoInfo, setGrupoInfo] = useState(state?.grupo ?? cached?.grupoInfo ?? null);
    const [anioId, setAnioId] = useState(state?.anio?.id ?? cached?.anioId ?? null);
    const [anioNombre, setAnioNombre] = useState(state?.anio?.anio ?? cached?.anioNombre ?? null);
    const [estudiante, setEstudiante] = useState(cached?.estudiante ?? null);
    const [resumen, setResumen] = useState(cached?.resumen ?? null);
    const [materias, setMaterias] = useState(cached?.materias ?? []);
    const [materiaActiva, setMateriaActiva] = useState(null);
    const [notas, setNotas] = useState(null);
    const [loadingNotas, setLoadingNotas] = useState(false);
    const [loading, setLoading] = useState(!cached);
    const [recalculando, setRecalculando] = useState(false);

    const desde = state?.desde ?? (esEstudiante ? "mi-perfil" : "estudiantes");
    const gradoId = state?.grado?.id;
    const grupoId = state?.grupo?.id;

    useEffect(() => {
        if (!id) return;
        if (accesoNegado) return;

        let cancelled = false;

        async function cargar() {
            try {
                let aid = anioId;
                let anioNombreActual = anioNombre;
                if (!aid) {
                    const activo = await getAnioActivo().catch(() => null);
                    aid = activo?.id ?? null;
                    anioNombreActual = activo?.anio ?? null;
                    if (!cancelled) {
                        setAnioId(aid);
                        setAnioNombre(anioNombreActual);
                    }
                }
                if (!aid || cancelled) return;

                const [est, res] = await Promise.all([
                    getEstudiante(id),
                    getResumen(id, aid),
                ]);
                if (cancelled) return;

                let resumenFinal = res;
                if (res?.promedioGeneral == null) {
                    try {
                        await recalcularEstadisticas(aid);
                        if (!cancelled) resumenFinal = await getResumen(id, aid);
                    } catch (e) { console.warn("Auto-recalculo falló:", e); }
                }
                if (cancelled) return;

                setEstudiante(est);
                setResumen(resumenFinal);

                let grupoInfoActual = state?.grupo ?? null;
                if (!state?.grupo && res?.grupoId && res?.gradoId) {
                    get(`/grupos/por-grado/${res.gradoId}`)
                        .then(r => {
                            const grupo = r.data.find(g => g.id === res.grupoId);
                            if (grupo && !cancelled) {
                                grupoInfoActual = grupo;
                                setGrupoInfo(grupo);
                            }
                        })
                        .catch(() => {});
                }

                const mats = await getMaterias(id, aid);
                if (cancelled) return;
                setMaterias(mats);

                if (rawId) {
                    _detalleCache[rawId] = {
                        estudiante: est,
                        resumen: resumenFinal,
                        materias: mats,
                        anioId: aid,
                        anioNombre: anioNombreActual,
                        grupoInfo: grupoInfoActual,
                    };
                }

                if (mats.length) {
                    setMateriaActiva(mats[0].id);
                    setLoadingNotas(true);
                    const payload = await getNotasMateria(id, mats[0].id, aid);
                    if (!cancelled) {
                        setNotas(payload);
                        setLoadingNotas(false);
                    }
                }
            } catch (err) {
                console.error("Error cargando datos:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        cargar();
        return () => { cancelled = true; };
    }, [id, anioId, accesoNegado]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSelectMateria = async (mId) => {
        setMateriaActiva(mId);
        setLoadingNotas(true);
        try {
            const payload = await getNotasMateria(id, mId, anioId);
            setNotas(payload);
        } finally { setLoadingNotas(false); }
    };

    const handleRecalcular = async () => {
        if (!anioId) return;
        setRecalculando(true);
        try {
            await recalcularEstadisticas(anioId);
            const res = await getResumen(id, anioId);
            setResumen(res);
        } catch (err) {
            console.error("Error recalculando:", err);
        } finally {
            setRecalculando(false);
        }
    };

    const handleVolver = () => {
        if (esEstudiante) {
            navigate(`/${slug}/dashboard`);
        } else if (esDocente) {
            navigate(`/${slug}/mis-asignaciones`);
        } else if (desde === "grupo" && gradoId && grupoId) {
            navigate(`/${slug}/grados/${gradoId}/grupos/${grupoId}/estudiantes`, {
                state: { grado: state?.grado, grupo: state?.grupo, anio: state?.anio },
            });
        } else {
            navigate(`/${slug}/estudiantes`);
        }
    };

    if (accesoNegado) {
        return (
            <div className="p-2">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <Lock size={40} className="mx-auto mb-3 text-red-400" />
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Acceso restringido</h3>
                    <p className="text-sm text-red-600">No tienes permiso para ver los datos de otro estudiante.</p>
                    <button
                        onClick={handleVolver}
                        className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm hover:bg-cyan-600 transition-colors"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    if (loading || loadingPerfil) {
        return (
            <div className="p-2 space-y-4">
                <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
                <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
        );
    }

    const gradoLabel = resumen?.gradoNombre ?? state?.grado?.nombre ?? null;
    const grupoLabel = resumen?.grupoNombre ?? grupoInfo?.nombre ?? (resumen?.grupoId ? `Grupo ${resumen.grupoId}` : null);
    const anioLabel = anioNombre ?? "—";

    return (
        <div className="p-2 space-y-4">

            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={handleVolver}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-800 truncate">
                        {esMiPerfil ? "Mi perfil académico" : (estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : "Detalle del estudiante")}
                    </h2>
                    <p className="text-sm text-gray-400">
                        {estudiante?.documento ? `Documento: ${estudiante.documento}` : ""}
                    </p>
                </div>
            </div>

            {/* Cards resumen */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Grado · Grupo · Año</p>
                    <p className="text-sm font-semibold text-gray-700">
                        {gradoLabel ? `${gradoLabel} · ` : ""}
                        {grupoLabel ?? "—"}
                        {" · "}
                        {anioLabel}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Promedio</p>
                    <p className="text-3xl font-extrabold text-cyan-500">{fmt(resumen?.promedioGeneral)}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Puesto</p>
                            <p className="text-3xl font-extrabold text-emerald-500">
                                {resumen?.puesto != null ? `#${resumen.puesto}` : "—"}
                            </p>
                        </div>
                        {esAdmin && (
                            <button
                                onClick={handleRecalcular}
                                disabled={recalculando}
                                title="Recalcular estadísticas"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors disabled:opacity-40"
                            >
                                <RefreshCw size={16} className={recalculando ? "animate-spin" : ""} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Materias + detalle */}
            <div className="flex flex-col lg:flex-row gap-4 items-start">

                {/* Lista materias */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full lg:w-60 lg:shrink-0">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 text-sm">Materias</h3>
                    </div>

                    {/* Mobile: tabs horizontales */}
                    <div className="flex lg:hidden overflow-x-auto gap-1 p-2 scrollbar-hide">
                        {materias.map(m => (
                            <button
                                key={m.id}
                                onClick={() => handleSelectMateria(m.id)}
                                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                                    m.id === materiaActiva
                                        ? "bg-cyan-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {m.nombre}
                            </button>
                        ))}
                    </div>

                    {/* Desktop: lista vertical */}
                    <ul className="hidden lg:block">
                        {materias.map(m => (
                            <li key={m.id}>
                                <button
                                    onClick={() => handleSelectMateria(m.id)}
                                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                                        m.id === materiaActiva
                                            ? "bg-cyan-50 text-cyan-600 font-semibold border-l-2 border-cyan-500"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {m.nombre}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Detalle notas */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm w-full min-w-0">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 text-sm">
                            {notas?.materia?.materiaNombre ?? "Selecciona una materia"}
                        </h3>
                        {notas?.materia && (
                            <p className="text-xs text-gray-400 mt-0.5">
                                Promedio: <span className="font-semibold text-gray-600">{fmt(notas.materia.promedioMateria)}</span>
                            </p>
                        )}
                    </div>

                    <div className="p-4 space-y-4">
                        {loadingNotas ? (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : !notas ? (
                            <p className="text-sm text-gray-400 text-center py-8">Selecciona una materia para ver las notas.</p>
                        ) : !notas.materia?.cortes?.length ? (
                            <p className="text-sm text-gray-400 text-center py-8">Sin notas registradas para esta materia.</p>
                        ) : (
                            notas.materia.cortes.map(c => (
                                <div key={c.corte} className="rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                                        <span className="text-sm font-semibold text-gray-700">Corte {c.corte}</span>
                                        <span className="text-xs text-gray-500">
                                            Promedio: <span className="font-semibold text-gray-700">{fmt(c.promedioCorte)}</span>
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm">
                                            <thead>
                                                <tr className="bg-cyan-500 text-white">
                                                    <th className="text-left px-4 py-2 font-semibold">Actividad</th>
                                                    <th className="text-left px-4 py-2 font-semibold w-16">%</th>
                                                    <th className="text-left px-4 py-2 font-semibold w-20">Nota</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(c.notas ?? []).map((n, i) => (
                                                    <tr key={i}
                                                        className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                                        <td className="px-4 py-2 text-gray-700">{n.nombre}</td>
                                                        <td className="px-4 py-2 text-gray-500">{fmt(n.porcentaje, 0)}%</td>
                                                        <td className="px-4 py-2 font-semibold text-gray-700">
                                                            {n.valor === null ? "—" : fmt(n.valor)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {esMiPerfil && (
                <div className="text-center text-xs text-gray-400 mt-2">
                    Esta es tu información académica personal. Solo tú puedes verla.
                </div>
            )}
        </div>
    );
}
