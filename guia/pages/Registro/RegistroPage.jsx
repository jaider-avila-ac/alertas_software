import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle, ArrowLeft, ArrowRight, CheckCircle2,
  Loader2, Eye, EyeOff, Building2, User,
} from "lucide-react";
import { registrarInstitucion } from "../../services/registro.service";
import logo from "../../assets/logo.png";

const STEPS = ["Administrador", "Institución", "Listo"];

const GENEROS = [
  { val: "M", label: "Masculino" },
  { val: "F", label: "Femenino" },
];

const RESERVED = ["super-admin", "sistema", "admin", "setup", "api", "registro", "dashboard", "login"];

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slugValid(s) {
  if (!s || s.length < 3 || s.length > 60) return false;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) return false;
  if (RESERVED.includes(s)) return false;
  return true;
}

export default function RegistroPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPassConf, setShowPassConf] = useState(false);

  /* ── Admin data ── */
  const [admin, setAdmin] = useState({
    nombres: "", apellidos: "", documento: "", genero: "M",
    correo: "", password: "", confirmar: "", telefono: "", direccion: "",
  });

  /* ── Institution data ── */
  const [inst, setInst] = useState({
    nombre: "", slug: "", direccion: "", contacto: "",
  });
  const [slugManual, setSlugManual] = useState(false);

  function setA(field, val) { setAdmin(p => ({ ...p, [field]: val })); }
  function setI(field, val) { setInst(p => ({ ...p, [field]: val })); }

  function handleNombreInst(val) {
    setI("nombre", val);
    if (!slugManual) setI("slug", slugify(val));
  }

  /* ── Paso 1: validación frontend ── */
  function validateStep0() {
    if (!admin.nombres.trim() || !admin.apellidos.trim() || !admin.documento.trim()) {
      return "Nombres, apellidos y documento son obligatorios.";
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(admin.correo)) {
      return "Correo electrónico inválido.";
    }
    if (admin.password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (admin.password !== admin.confirmar) {
      return "Las contraseñas no coinciden.";
    }
    return null;
  }

  /* ── Paso 2: validación frontend ── */
  function validateStep1() {
    if (!inst.nombre.trim()) return "El nombre de la institución es obligatorio.";
    if (!slugValid(inst.slug)) {
      return "El subdominio no es válido. Usa solo letras minúsculas, números y guiones (mín. 3 caracteres).";
    }
    return null;
  }

  function nextStep() {
    setError("");
    if (step === 0) {
      const err = validateStep0();
      if (err) { setError(err); return; }
    }
    setStep(s => s + 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validateStep1();
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");
    try {
      const payload = {
        adminNombres:    admin.nombres,
        adminApellidos:  admin.apellidos,
        adminDocumento:  admin.documento,
        adminGenero:     admin.genero,
        adminCorreo:     admin.correo,
        password:        admin.password,
        adminTelefono:   admin.telefono || null,
        adminDireccion:  admin.direccion || null,
        instNombre:      inst.nombre,
        instSlug:        inst.slug,
        instDireccion:   inst.direccion || null,
        instContacto:    inst.contacto || null,
      };
      console.log("📤 Payload enviado:", JSON.stringify(payload, null, 2));
      console.log("📡 URL completa destino:", window.location.origin + "/api/registro/institucion");
      console.log("🔑 Token en localStorage:", localStorage.getItem("siat_token") ? "SÍ hay token guardado" : "Sin token");
      await registrarInstitucion(payload);
      setStep(2);
    } catch (ex) {
      console.error("❌ Error completo:", ex?.response?.status, ex?.response?.data);
      const msg = ex?.response?.data?.error ?? ex?.response?.data?.mensaje ?? ex?.response?.data ?? "Error al registrar.";
      setError(typeof msg === "string" ? msg : "Error al registrar.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Render helpers ── */
  const inputCls = "w-full bg-transparent border-0 border-b border-gray-300 focus:border-cyan-500 focus:outline-none text-gray-800 text-sm py-2 transition-colors placeholder:text-gray-300";
  const labelCls = "block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-widest";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-linear-to-r from-cyan-500 to-cyan-400 px-8 py-6 text-white">
          <img src={logo} alt="Logo" className="h-8 w-auto mb-3 brightness-0 invert" />
          <h1 className="text-xl font-bold">Registrar institución</h1>
          <p className="text-cyan-100 text-sm mt-0.5">
            Crea la cuenta de tu institución educativa
          </p>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mt-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${i < step ? "bg-white text-cyan-500" : i === step ? "bg-cyan-600 text-white border-2 border-white" : "bg-cyan-400 text-cyan-100"}`}>
                  {i < step ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span className={`text-xs ${i === step ? "font-semibold" : "text-cyan-200"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className="w-6 h-px bg-cyan-300 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 py-6">

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* ── STEP 0: Admin data ── */}
          {step === 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User size={16} className="text-cyan-500" />
                <h2 className="font-semibold text-gray-700 text-sm">Datos del administrador</h2>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <div>
                  <label className={labelCls}>Nombres *</label>
                  <input className={inputCls} value={admin.nombres}
                    onChange={e => setA("nombres", e.target.value)} placeholder="Juan David" />
                </div>
                <div>
                  <label className={labelCls}>Apellidos *</label>
                  <input className={inputCls} value={admin.apellidos}
                    onChange={e => setA("apellidos", e.target.value)} placeholder="García López" />
                </div>
                <div>
                  <label className={labelCls}>Documento *</label>
                  <input className={inputCls} value={admin.documento}
                    onChange={e => setA("documento", e.target.value)} placeholder="1234567890" />
                </div>
                <div>
                  <label className={labelCls}>Género</label>
                  <select className={`${inputCls} cursor-pointer`} value={admin.genero}
                    onChange={e => setA("genero", e.target.value)}>
                    {GENEROS.map(g => <option key={g.val} value={g.val}>{g.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Correo electrónico *</label>
                  <input type="email" className={inputCls} value={admin.correo}
                    onChange={e => setA("correo", e.target.value)} placeholder="admin@miinstitucion.edu.co" />
                </div>
                <div className="relative">
                  <label className={labelCls}>Contraseña *</label>
                  <input type={showPass ? "text" : "password"} className={`${inputCls} pr-7`}
                    value={admin.password} onChange={e => setA("password", e.target.value)}
                    placeholder="Mín. 8 caracteres" />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="relative">
                  <label className={labelCls}>Confirmar *</label>
                  <input type={showPassConf ? "text" : "password"} className={`${inputCls} pr-7`}
                    value={admin.confirmar} onChange={e => setA("confirmar", e.target.value)}
                    placeholder="Repite la contraseña" />
                  <button type="button" onClick={() => setShowPassConf(v => !v)}
                    className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-600">
                    {showPassConf ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input className={inputCls} value={admin.telefono}
                    onChange={e => setA("telefono", e.target.value)} placeholder="3001234567" />
                </div>
                <div>
                  <label className={labelCls}>Dirección</label>
                  <input className={inputCls} value={admin.direccion}
                    onChange={e => setA("direccion", e.target.value)} placeholder="Calle 1 # 2-3" />
                </div>
              </div>

              <button onClick={nextStep}
                className="mt-6 flex items-center justify-center gap-2 w-full bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-semibold py-3 rounded-xl transition-colors">
                Siguiente <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* ── STEP 1: Institution data ── */}
          {step === 1 && (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={16} className="text-cyan-500" />
                <h2 className="font-semibold text-gray-700 text-sm">Datos de la institución</h2>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className={labelCls}>Nombre de la institución *</label>
                  <input className={inputCls} value={inst.nombre}
                    onChange={e => handleNombreInst(e.target.value)}
                    placeholder="Colegio San José" />
                </div>

                <div>
                  <label className={labelCls}>Subdominio (URL de acceso) *</label>
                  <input className={`${inputCls} font-mono`} value={inst.slug}
                    onChange={e => { setSlugManual(true); setI("slug", slugify(e.target.value)); }}
                    placeholder="colegio-san-jose" />
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className={`inline-block w-2 h-2 rounded-full ${slugValid(inst.slug) ? "bg-green-400" : "bg-red-300"}`} />
                    <span className="text-xs text-gray-400 font-mono">
                      {window.location.origin}/<span className="text-cyan-600">{inst.slug || "tu-institucion"}</span>
                    </span>
                  </div>
                  {inst.slug && !slugValid(inst.slug) && (
                    <p className="text-xs text-red-400 mt-1">
                      Solo letras minúsculas, números y guiones. Mín. 3 caracteres.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Dirección</label>
                  <input className={inputCls} value={inst.direccion}
                    onChange={e => setI("direccion", e.target.value)} placeholder="Calle 10 # 5-20, Ciudad" />
                </div>

                <div>
                  <label className={labelCls}>Contacto</label>
                  <input className={inputCls} value={inst.contacto}
                    onChange={e => setI("contacto", e.target.value)} placeholder="contacto@institucion.edu.co" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => { setStep(0); setError(""); }}
                  className="flex items-center gap-1 px-4 py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <ArrowLeft size={14} /> Atrás
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
                  {loading ? <Loader2 size={15} className="animate-spin" /> : "Registrar institución"}
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 2: Success ── */}
          {step === 2 && (
            <div className="text-center py-4">
              <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-gray-800 mb-2">¡Registro exitoso!</h2>
              <p className="text-sm text-gray-500 mb-5">
                Tu institución ha sido registrada y está pendiente de activación.
                El administrador del sistema la habilitará próximamente.
              </p>

              <div className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-4 mb-6 text-left">
                <p className="text-xs text-gray-400 mb-1">Tu URL de inicio de sesión:</p>
                <span className="font-mono text-sm text-cyan-600 break-all">
                  {window.location.origin}/{inst.slug}
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-6">
                Una vez habilitada, podrás iniciar sesión con el correo y contraseña que registraste.
              </p>

              <Link to={`/${inst.slug}`}
                className="inline-block bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
                Ir al inicio de sesión
              </Link>
            </div>
          )}

          {/* Pie */}
          {step < 2 && (
            <p className="text-center text-xs text-gray-400 mt-5">
              ¿Ya tienes cuenta?{" "}
              <Link to="/super-admin" className="text-cyan-500 hover:text-cyan-400 font-medium">
                Inicia sesión
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
