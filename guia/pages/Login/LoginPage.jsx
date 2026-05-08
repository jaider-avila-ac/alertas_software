import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Loader2, Eye, EyeOff, Building2, AlertTriangle } from "lucide-react";
import { useLoginPage } from "./useLoginPage";

import loginHero from "../../assets/login-hero.png";
import logo      from "../../assets/logo.png";

export default function LoginPage() {
  const {
    instInfo, instError, loadingInfo, esSuperAdmin,
    isCorreo,
    correo,   setCorreo,
    password, setPassword,
    showPass, setShowPass,
    loading, error,
    conflictoSesion,
    handleCorreo, handlePassword, handleForzarSesion, volverACorreo,
  } = useLoginPage();

  if (loadingInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 size={32} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  if (instError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Acceso no disponible</h2>
          <p className="text-sm text-gray-500 mb-6">{instError}</p>
          <Link to="/registro" className="text-cyan-500 hover:text-cyan-400 text-sm font-medium">
            Registrar mi institución
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* ── Formulario ── */}
        <div className="flex flex-col px-8 pt-4 pb-10 sm:px-12 sm:pt-10 sm:pb-14 w-full lg:w-125">

          <div className="mb-4 flex justify-center">
            <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          </div>

          <div className="mb-12">
            {esSuperAdmin ? (
              <h1 className="text-4xl font-black tracking-tighter text-cyan-600 leading-none uppercase">
                ADMIN <span className="text-slate-800">GLOBAL</span>
              </h1>
            ) : (
              <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase leading-[0.9] wrap-break-word">
                {instInfo?.nombre || "Institución"}
              </h1>
            )}
            <div className="h-2 w-16 bg-cyan-500 mt-4 rounded-full" />
          </div>

          {/* Error normal */}
          <div className="h-14 mb-4 flex items-center">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3 w-full animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={18} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>

          {/* Conflicto de sesión activa */}
          {conflictoSesion && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Sesión activa detectada</p>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Ya hay una sesión activa en otro dispositivo. Puedes cerrarla y continuar aquí, o cancelar.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={volverACorreo}
                  className="flex-1 text-xs font-semibold text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg py-2 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleForzarSesion}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-white rounded-lg py-2 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={12} className="animate-spin" /> : null}
                  Usar esta sesión
                </button>
              </div>
            </div>
          )}

          {/* Flujo de pasos */}
          <div className="relative" style={{ height: 200 }}>

            {/* Paso 1: Correo */}
            <div
              className="absolute inset-0 transition-all duration-500 ease-in-out"
              style={{
                opacity:       isCorreo ? 1 : 0,
                transform:     isCorreo ? "translateY(0)" : "translateY(-20px)",
                pointerEvents: isCorreo ? "auto" : "none",
              }}
            >
              <form onSubmit={handleCorreo} className="flex flex-col gap-8">
                <div className="group">
                  <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.2em] group-focus-within:text-cyan-600 transition-colors">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="w-full bg-transparent border-b-2 border-gray-200 focus:border-cyan-500 focus:outline-none text-gray-800 text-lg py-2 transition-all placeholder:text-gray-200"
                    value={correo}
                    onChange={e => setCorreo(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    required
                    tabIndex={isCorreo ? 0 : -1}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-cyan-600 text-white text-sm font-bold py-4 rounded-2xl transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : "CONTINUAR"}
                </button>
              </form>
            </div>

            {/* Paso 2: Contraseña */}
            <div
              className="absolute inset-0 transition-all duration-500 ease-in-out"
              style={{
                opacity:       (!isCorreo && !conflictoSesion) ? 1 : 0,
                transform:     (!isCorreo && !conflictoSesion) ? "translateY(0)" : "translateY(20px)",
                pointerEvents: (!isCorreo && !conflictoSesion) ? "auto" : "none",
              }}
            >
              <form onSubmit={handlePassword} className="flex flex-col gap-6">
                <div className="relative group">
                  <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.2em] group-focus-within:text-cyan-600 transition-colors">
                    Contraseña de acceso
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full bg-transparent border-b-2 border-gray-200 focus:border-cyan-500 focus:outline-none text-gray-800 text-lg py-2 transition-all"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    tabIndex={(!isCorreo && !conflictoSesion) ? 0 : -1}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-0 bottom-3 text-gray-400 hover:text-cyan-600"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98]"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : "ENTRAR AL SISTEMA"}
                  </button>
                  <button
                    type="button"
                    onClick={volverACorreo}
                    className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-slate-800 transition-colors uppercase tracking-widest"
                  >
                    <ArrowLeft size={14} /> Corregir correo
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Pie */}
          {!esSuperAdmin && (
            <div className="mt-auto pt-8 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 font-medium">
                ¿TU INSTITUCIÓN NO TIENE CUENTA?{" "}
                <Link
                  to="/registro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600 hover:text-cyan-500 font-black ml-1"
                >
                  REGISTRAR AQUÍ
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* ── Panel decorativo ── */}
        <div className="hidden lg:flex flex-1 bg-slate-50 items-center justify-center p-12 border-l border-gray-100 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100/30 rounded-bl-full" />
          <img src={loginHero} alt="Ilustración" className="relative max-w-sm w-full drop-shadow-2xl" />
        </div>
      </div>
    </div>
  );
}
