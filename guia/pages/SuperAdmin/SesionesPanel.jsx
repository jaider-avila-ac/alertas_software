import { useState, useEffect } from "react";
import { Monitor, Smartphone, Globe, Wifi, Clock, User } from "lucide-react";

const ROL_LABELS = {
  ADMIN_INSTITUCION: "Admin",
  DOCENTE: "Docente",
  ESTUDIANTE: "Estudiante",
  SUPER_ADMIN: "Super Admin",
};

const ROL_COLORS = {
  ADMIN_INSTITUCION: "bg-blue-50 text-blue-600 border-blue-200",
  DOCENTE: "bg-purple-50 text-purple-600 border-purple-200",
  ESTUDIANTE: "bg-emerald-50 text-emerald-600 border-emerald-200",
  SUPER_ADMIN: "bg-cyan-50 text-cyan-600 border-cyan-200",
};

function BrowserIcon({ navegador }) {
  const map = { Chrome: "🌐", Firefox: "🦊", Safari: "🧭", Edge: "🔷", Opera: "🎭" };
  return <span className="text-sm">{map[navegador] ?? "🌐"}</span>;
}

function OsIcon({ os }) {
  const mobile = os === "Android" || os === "iOS";
  return mobile
    ? <Smartphone size={11} className="text-gray-400" />
    : <Monitor size={11} className="text-gray-400" />;
}

function formatTiempo(loginTime) {
  const totalSec = Math.max(0, Math.floor((Date.now() - loginTime) / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = n => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export default function SesionesPanel({ sesiones }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!sesiones || sesiones.length === 0) {
    return (
      <p className="text-xs text-gray-400 italic px-1 py-2">Sin sesiones activas</p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {sesiones.map(s => (
        <div key={s.correo}
          className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">

          <div className="min-w-0">
            {/* Nombre y rol */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-gray-700 truncate">
                {s.nombres} {s.apellidos}
              </span>
              <span className={`text-[10px] font-semibold border px-1.5 py-0 rounded-full ${ROL_COLORS[s.rol?.toUpperCase()] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                {ROL_LABELS[s.rol?.toUpperCase()] ?? s.rol}
              </span>
            </div>

            {/* Correo */}
            <p className="text-[10px] text-gray-400 truncate font-mono">{s.correo}</p>

            {/* Info técnica */}
            <div className="flex items-center gap-2.5 mt-1 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                <BrowserIcon navegador={s.navegador} /> {s.navegador}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                <OsIcon os={s.sistemaOperativo} /> {s.sistemaOperativo}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                <Wifi size={10} className="text-gray-400" /> {s.ip}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-mono font-semibold">
                <Clock size={10} /> {formatTiempo(s.loginTime)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
