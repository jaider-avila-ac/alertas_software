import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerPerfilDetalle, actualizarMiPerfil } from "../../services/auth.service";
import { User, Lock, Mail, Save } from "lucide-react";

const Campo = ({ label, name, value, onChange, type = "text", disabled = false }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <input
      name={name} type={type} value={value} onChange={onChange} disabled={disabled}
      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400
        ${disabled ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed" : "border-gray-200"}`}
    />
  </div>
);

export default function PerfilPage() {
  const { perfil, loadingPerfil } = useAuth();
  const rol = perfil?.rol?.toUpperCase() ?? "";
  const esAdmin = rol === "ADMIN_INSTITUCION";

  const [datos, setDatos] = useState(null);
  const [loadingDatos, setLoadingDatos] = useState(true);
  const [form, setForm] = useState({
    nombres: "", apellidos: "", documento: "", genero: "",
    direccion: "", telefono: "", correo: "",
    password: "", confirmarPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (loadingPerfil) return;
    obtenerPerfilDetalle()
      .then(d => {
        setDatos(d);
        setForm({
          nombres:           d.nombres   ?? "",
          apellidos:         d.apellidos ?? "",
          documento:         d.documento ?? "",
          genero:            d.genero    ?? "",
          direccion:         d.direccion ?? "",
          telefono:          d.telefono  ?? "",
          correo:            d.correo    ?? "",
          password:          "",
          confirmarPassword: "",
        });
      })
      .catch(() => setDatos(null))
      .finally(() => setLoadingDatos(false));
  }, [loadingPerfil]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje(null);

    if (form.password && form.password !== form.confirmarPassword) {
      setMensaje({ tipo: "error", texto: "Las contraseñas no coinciden." });
      return;
    }
    if (form.password && form.password.length < 8) {
      setMensaje({ tipo: "error", texto: "La contraseña debe tener al menos 8 caracteres." });
      return;
    }

    const payload = {};

    if (esAdmin) {
      if (form.nombres)   payload.nombres   = form.nombres;
      if (form.apellidos) payload.apellidos = form.apellidos;
      payload.documento = form.documento;
      payload.genero    = form.genero;
    }

    // Editable por todos los roles
    payload.direccion = form.direccion;
    payload.telefono  = form.telefono;
    if (form.correo && form.correo !== datos?.correo) payload.correo = form.correo;
    if (form.password) payload.password = form.password;

    // Si solo quedan direccion/telefono vacíos y sin cambios reales, avisamos
    const tieneCambios =
      esAdmin ||
      form.direccion !== (datos?.direccion ?? "") ||
      form.telefono  !== (datos?.telefono  ?? "") ||
      (form.correo && form.correo !== datos?.correo) ||
      !!form.password;

    if (!tieneCambios) {
      setMensaje({ tipo: "error", texto: "No hay cambios para guardar." });
      return;
    }

    try {
      setSaving(true);
      await actualizarMiPerfil(payload);
      setMensaje({ tipo: "ok", texto: "Perfil actualizado correctamente." });
      setForm(f => ({ ...f, password: "", confirmarPassword: "" }));
      if (payload.correo) setDatos(d => ({ ...d, correo: payload.correo }));
    } catch (err) {
      const msg = err?.response?.data?.mensaje ?? "Error al actualizar el perfil.";
      setMensaje({ tipo: "error", texto: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loadingPerfil || loadingDatos) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-lg mx-auto space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-800">Mi perfil</h2>
        <p className="text-sm text-gray-400">{perfil?.institucion?.nombre}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">

        {/* Información personal */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <User size={13} /> Información personal
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Nombres"   name="nombres"   value={form.nombres}   onChange={handleChange} disabled={!esAdmin} />
            <Campo label="Apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} disabled={!esAdmin} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Documento" name="documento" value={form.documento} onChange={handleChange} disabled={!esAdmin} />
            <div>
              <label className="block text-xs text-gray-500 mb-1">Género</label>
              <select
                name="genero" value={form.genero} onChange={handleChange} disabled={!esAdmin}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400
                  ${!esAdmin ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed" : "border-gray-200"}`}
              >
                <option value="">— Seleccionar —</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>
          <Campo label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} />
          <Campo label="Teléfono"  name="telefono"  value={form.telefono}  onChange={handleChange} />
        </section>

        {/* Correo */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <Mail size={13} /> Correo electrónico
          </h3>
          <Campo label="Correo" name="correo" type="email" value={form.correo} onChange={handleChange} />
        </section>

        {/* Contraseña */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <Lock size={13} /> Cambiar contraseña
          </h3>
          <Campo label="Nueva contraseña"     name="password"          type="password" value={form.password}          onChange={handleChange} />
          <Campo label="Confirmar contraseña" name="confirmarPassword" type="password" value={form.confirmarPassword} onChange={handleChange} />
        </section>

        {!esAdmin && (
          <p className="text-xs text-gray-400">
            Solo puedes modificar dirección, teléfono, correo y contraseña.
          </p>
        )}

        {mensaje && (
          <p className={`text-sm rounded-lg px-3 py-2 ${mensaje.tipo === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
            {mensaje.texto}
          </p>
        )}

        <button
          type="submit" disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <Save size={15} />
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
