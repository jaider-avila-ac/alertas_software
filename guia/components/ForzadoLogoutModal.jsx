import { AlertTriangle, Monitor, Globe, Clock } from "lucide-react";

function fmt(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
}

export default function ForzadoLogoutModal({ info, onConfirm }) {
  if (!info) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
        <div className="bg-red-500 px-6 py-4 flex items-center gap-3">
          <AlertTriangle size={22} className="text-white shrink-0" />
          <h2 className="text-white font-bold text-sm">Sesión cerrada remotamente</h2>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-700">
            Tu sesión fue cerrada porque alguien inició sesión con tu cuenta en otro dispositivo.
          </p>

          <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-100 text-xs">
            <div className="flex items-center gap-3 px-4 py-3">
              <Monitor size={14} className="text-gray-400 shrink-0" />
              <div>
                <span className="text-gray-400 uppercase tracking-wide text-[10px] font-semibold">Navegador</span>
                <p className="text-gray-700 font-medium mt-0.5">{info.navegador ?? "Desconocido"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Globe size={14} className="text-gray-400 shrink-0" />
              <div>
                <span className="text-gray-400 uppercase tracking-wide text-[10px] font-semibold">Dirección IP</span>
                <p className="text-gray-700 font-medium mt-0.5">{info.ip ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Clock size={14} className="text-gray-400 shrink-0" />
              <div>
                <span className="text-gray-400 uppercase tracking-wide text-[10px] font-semibold">Hora de inicio</span>
                <p className="text-gray-700 font-medium mt-0.5">{fmt(info.loginTime)}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Si no fuiste tú, cambia tu contraseña inmediatamente.
          </p>

          <button
            onClick={onConfirm}
            className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-3 rounded-xl transition-colors"
          >
            Entendido, ir al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
}
