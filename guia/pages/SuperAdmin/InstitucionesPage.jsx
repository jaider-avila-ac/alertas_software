import { useState, useEffect } from "react";
import { Building2, CheckCircle2, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import {
  listarInstituciones,
  habilitarInstitucion,
  deshabilitarInstitucion,
} from "../../services/superadmin.service";
import { getApiToken } from "../../services/api";
import { API_BASE_URL } from "../../config/config";
import InstitucionCard from "./InstitucionCard";

export default function InstitucionesPage() {
  const [instituciones, setInstituciones] = useState([]);
  const [sesiones, setSesiones]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback]           = useState("");
  const [sseConectado, setSseConectado]   = useState(false);

  // SSE instituciones + REST inicial
  useEffect(() => {
    let active = true;
    const ctrl = new AbortController();

    listarInstituciones()
      .then(data => { if (active) { setInstituciones(data); setLoading(false); } })
      .catch(() => { if (active) { setError("No se pudieron cargar las instituciones."); setLoading(false); } });

    const conectar = async () => {
      const token = getApiToken();
      if (!token) return;
      try {
        const resp = await fetch(`${API_BASE_URL}/super-admin/instituciones/stream`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: ctrl.signal,
        });
        if (!resp.ok || !resp.body) return;
        if (active) setSseConectado(true);
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        while (active) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const ln of lines) {
            if (ln.startsWith("data:")) {
              try {
                const d = JSON.parse(ln.slice(5).trim());
                if (active) { setInstituciones(d); setLoading(false); }
              } catch { /* ignore malformed */ }
            }
          }
        }
      } catch {
        if (!active) return;
        setSseConectado(false);
        setTimeout(() => { if (active) conectar(); }, 4000);
      }
    };

    conectar();
    return () => { active = false; ctrl.abort(); setSseConectado(false); };
  }, []);

  // SSE sesiones activas
  useEffect(() => {
    let active = true;
    const ctrl = new AbortController();

    const conectar = async () => {
      const token = getApiToken();
      if (!token) return;
      try {
        const resp = await fetch(`${API_BASE_URL}/super-admin/sesiones/stream`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: ctrl.signal,
        });
        if (!resp.ok || !resp.body) return;
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        while (active) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const ln of lines) {
            if (ln.startsWith("data:")) {
              try {
                const d = JSON.parse(ln.slice(5).trim());
                if (active) setSesiones(d);
              } catch { /* ignore malformed */ }
            }
          }
        }
      } catch {
        if (!active) return;
        setTimeout(() => { if (active) conectar(); }, 4000);
      }
    };

    conectar();
    return () => { active = false; ctrl.abort(); };
  }, []);

  async function cargar() {
    setLoading(true);
    setError("");
    try {
      const data = await listarInstituciones();
      setInstituciones(data);
    } catch {
      setError("No se pudieron cargar las instituciones.");
    } finally {
      setLoading(false);
    }
  }

  function showFeedback(msg) {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 3500);
  }

  async function handleHabilitar(id, nombre) {
    setActionLoading(`habilitar-${id}`);
    try {
      await habilitarInstitucion(id);
      showFeedback(`"${nombre}" habilitada.`);
    } catch {
      setError("Error al habilitar la institución.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeshabilitar(id, nombre) {
    if (!window.confirm(`¿Deshabilitar "${nombre}"? Los usuarios no podrán iniciar sesión.`)) return;
    setActionLoading(`deshabilitar-${id}`);
    try {
      await deshabilitarInstitucion(id);
      showFeedback(`"${nombre}" deshabilitada.`);
    } catch {
      setError("Error al deshabilitar la institución.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h5 className="text-xl font-bold text-gray-800">Instituciones</h5>
          <p className="text-sm text-gray-400 flex items-center gap-1.5">
            Gestión global de instituciones
            {sseConectado
              ? <span className="inline-flex items-center gap-1 text-xs text-green-500"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" /> En vivo</span>
              : <span className="inline-flex items-center gap-1 text-xs text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" /> Reconectando…</span>
            }
          </p>
        </div>
        <button onClick={cargar} disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Actualizar
        </button>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4">
          <CheckCircle2 size={15} /> {feedback}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-4">
          <AlertCircle size={15} /> {error}
          <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-cyan-400" />
        </div>
      )}

      {!loading && instituciones.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Building2 size={40} className="text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm">No hay instituciones registradas.</p>
        </div>
      )}

      {!loading && instituciones.length > 0 && (
        <div className="flex flex-col gap-3">
          {instituciones.map(inst => (
            <InstitucionCard
              key={inst.id}
              inst={inst}
              sesiones={sesiones}
              actionLoading={actionLoading}
              onHabilitar={handleHabilitar}
              onDeshabilitar={handleDeshabilitar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
