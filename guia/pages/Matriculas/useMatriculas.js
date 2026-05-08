import { useState, useEffect } from "react";
import {
  obtenerEstudiantesSinMatricula,
  obtenerAnioActivo,
  obtenerGrados,
  obtenerGruposPorGrado,
  obtenerMatriculados,
  matricularEstudiante,
  eliminarMatricula,
  retirarMatricula,
} from "../../services/matriculas.service";

const sortNombre = (arr) =>
  [...arr].sort((a, b) =>
    `${a.nombres ?? a.nombre ?? ""} ${a.apellidos ?? ""}`.localeCompare(
      `${b.nombres ?? b.nombre ?? ""} ${b.apellidos ?? ""}`
    )
  );

let _matriculasCache = null; // { sinMatricula, anioActivo, grados, matriculados }

export function useMatriculas() {
  /* ── Datos base ── */
  const [sinMatricula, setSinMatricula] = useState(_matriculasCache?.sinMatricula ?? []);
  const [anioActivo, setAnioActivo] = useState(_matriculasCache?.anioActivo ?? null);
  const [grados, setGrados] = useState(_matriculasCache?.grados ?? []);
  const [grupos, setGrupos] = useState([]);
  const [matriculados, setMatriculados] = useState(_matriculasCache?.matriculados ?? []);

  /* ── Estados de carga ── */
  const [loadingInit, setLoadingInit] = useState(!_matriculasCache);
  const [loadingGrupos, setLoadingGrupos] = useState(false);
  const [loadingTabla, setLoadingTabla] = useState(false); // Línea corregida
  const [saving, setSaving] = useState(false);
  const [eliminando, setEliminando] = useState({});
  const [retirando,  setRetirando]  = useState({});

  /* ── Formulario ── */
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [gradoId, setGradoId] = useState("");
  const [grupoId, setGrupoId] = useState("");
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* ── Búsqueda ── */
  const [query, setQuery] = useState("");

  /* ── Carga inicial ── */
  useEffect(() => {
    let active = true;
    Promise.all([
      obtenerEstudiantesSinMatricula().catch(() => []),
      obtenerAnioActivo().catch(() => null),
      obtenerGrados().catch(() => []),
      obtenerMatriculados().catch(() => []),
    ]).then(([sinMat, anio, grds, mats]) => {
      if (!active) return;
      const sinSorted = sortNombre(sinMat);
      const grdsSorted = sortNombre(grds);
      _matriculasCache = { sinMatricula: sinSorted, anioActivo: anio, grados: grdsSorted, matriculados: mats };
      setSinMatricula(sinSorted);
      setAnioActivo(anio);
      setGrados(grdsSorted);
      setMatriculados(mats);
    }).finally(() => { if (active) setLoadingInit(false); });
    return () => { active = false; };
  }, []);

  /* ── Lógica de Grupos ── */
  const handleGradoChange = async (id) => {
    setGradoId(id);
    setGrupoId("");
    setGrupos([]);
    if (!id) return;
    setLoadingGrupos(true);
    try {
      const data = await obtenerGruposPorGrado(id);
      setGrupos(sortNombre(data));
    } finally { setLoadingGrupos(false); }
  };

  const seleccionar = (est) => {
    setEstudianteSeleccionado(est);
    setFormError("");
    setSuccessMsg("");
  };

  /* ── Recargar Datos (Usa loadingTabla) ── */
  const recargar = async () => {
    setLoadingTabla(true);
    try {
      const [sinMat, mats] = await Promise.all([
        obtenerEstudiantesSinMatricula().catch(() => []),
        obtenerMatriculados().catch(() => []),
      ]);
      const sinSorted = sortNombre(sinMat);
      if (_matriculasCache) _matriculasCache = { ..._matriculasCache, sinMatricula: sinSorted, matriculados: mats };
      setSinMatricula(sinSorted);
      setMatriculados(mats);
    } finally {
      setLoadingTabla(false);
    }
  };

  /* ── Matricular ── */
  const handleMatricular = async () => {
    if (!estudianteSeleccionado || !anioActivo || !gradoId || !grupoId) {
      setFormError("Completa todos los campos.");
      return;
    }
    setSaving(true); setFormError(""); setSuccessMsg("");
    try {
      await matricularEstudiante({
        estudianteId: estudianteSeleccionado.id,
        anioId: anioActivo.id,
        gradoId,
        grupoId,
      });
      setEstudianteSeleccionado(null);
      setGradoId(""); setGrupoId(""); setGrupos([]);
      setSuccessMsg("Estudiante matriculado correctamente.");
      setTimeout(() => setSuccessMsg(""), 3000);
      await recargar();
    } catch (err) {
      setFormError(err?.response?.data?.mensaje ?? "Error al matricular.");
    } finally { setSaving(false); }
  };

  /* ── Eliminar (solo admin técnico, no expuesto en UI normal) ── */
  const handleEliminar = async (id) => {
    setEliminando(prev => ({ ...prev, [id]: true }));
    try {
      await eliminarMatricula(id);
      await recargar();
    } finally { setEliminando(prev => ({ ...prev, [id]: false })); }
  };

  /* ── Retirar (cambia estado a RETIRADO, conserva notas) ── */
  const handleRetirar = async (id) => {
    setRetirando(prev => ({ ...prev, [id]: true }));
    try {
      await retirarMatricula(id);
      await recargar();
    } finally { setRetirando(prev => ({ ...prev, [id]: false })); }
  };

  /* ── Filtro ── */
  const sinMatriculaFiltrados = query.trim()
    ? sinMatricula.filter(e => {
        const q = query.toLowerCase();
        return (
          (e.nombres ?? "").toLowerCase().includes(q) ||
          (e.apellidos ?? "").toLowerCase().includes(q) ||
          (e.documento ?? "").includes(q)
        );
      })
    : sinMatricula;

  return {
    sinMatriculaFiltrados, anioActivo, grados, grupos, matriculados,
    loadingInit, loadingGrupos, loadingTabla, saving, eliminando, retirando,
    estudianteSeleccionado, gradoId, grupoId, formError, successMsg,
    query, setQuery,
    seleccionar, handleGradoChange, setGrupoId,
    handleMatricular, handleEliminar, handleRetirar,
  };
}