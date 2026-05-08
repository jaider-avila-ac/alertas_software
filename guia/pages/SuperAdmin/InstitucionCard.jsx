import { Building2, Users, GraduationCap, Power, PowerOff, Loader2 } from "lucide-react";
import { CheckCircle2, XCircle } from "lucide-react";
import SesionesPanel from "./SesionesPanel";

function Badge({ habilitado }) {
  return habilitado ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full">
      <CheckCircle2 size={11} /> Habilitada
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-yellow-50 text-yellow-600 border border-yellow-200 px-2 py-0.5 rounded-full">
      <XCircle size={11} /> Pendiente
    </span>
  );
}

function ActionBtn({ onClick, disabled, color, Icon, label }) {
  const colors = {
    green: "bg-green-50 text-green-600 hover:bg-green-100 border-green-200",
    red:   "bg-red-50 text-red-500 hover:bg-red-100 border-red-200",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors disabled:opacity-40 ${colors[color]}`}
    >
      {disabled ? <Loader2 size={12} className="animate-spin" /> : <Icon size={12} />}
      {label}
    </button>
  );
}

export default function InstitucionCard({ inst, sesiones, actionLoading, onHabilitar, onDeshabilitar }) {
  const sesionesInst = (sesiones ?? []).filter(s => s.institucionId === inst.id);
  const count = sesionesInst.length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">

      {/* Fila superior: icono + info + botones */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0 mt-0.5">
            <Building2 size={18} className="text-cyan-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-800 text-sm">{inst.nombre}</span>
              <Badge habilitado={inst.habilitado} />
              {count > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  {count} activo{count !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              Admin: <span className="text-gray-600">{inst.adminNombres} {inst.adminApellidos}</span>
              {" · "}<span className="font-mono">{inst.adminCorreo}</span>
            </p>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Users size={11} className="text-cyan-400" />
                <span className="font-semibold text-gray-700">{inst.numDocentes}</span> docentes
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <GraduationCap size={11} className="text-emerald-400" />
                <span className="font-semibold text-gray-700">{inst.numEstudiantes}</span> estudiantes
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 sm:self-center">
          {inst.habilitado ? (
            <ActionBtn
              onClick={() => onDeshabilitar(inst.id, inst.nombre)}
              disabled={actionLoading === `deshabilitar-${inst.id}`}
              color="red" Icon={PowerOff} label="Deshabilitar"
            />
          ) : (
            <ActionBtn
              onClick={() => onHabilitar(inst.id, inst.nombre)}
              disabled={actionLoading === `habilitar-${inst.id}`}
              color="green" Icon={Power} label="Habilitar"
            />
          )}
        </div>
      </div>

      {/* Sesiones activas */}
      <div className="mt-3 pt-3 border-t border-gray-50">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          Sesiones activas
        </p>
        <SesionesPanel sesiones={sesionesInst} />
      </div>
    </div>
  );
}
