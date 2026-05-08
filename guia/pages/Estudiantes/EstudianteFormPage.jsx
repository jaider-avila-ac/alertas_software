import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { crearEstudiante, actualizarEstudiante } from "../../services/estudiantes.service";
import { showToast } from "../../utils/notifications";

const FORM_VACIO = {
  nombres: "", apellidos: "", documento: "",
  genero: "", direccion: "", correo: "", telefono: "",
};

export default function EstudianteFormPage() {
  const navigate  = useNavigate();
  const { id , slug}    = useParams();
  const { state } = useLocation();

  const esEdicion = Boolean(id);
  const inicial   = esEdicion && state?.estudiante
    ? {
        nombres:   state.estudiante.nombres   ?? "",
        apellidos: state.estudiante.apellidos ?? "",
        documento: state.estudiante.documento ?? "",
        genero:    state.estudiante.genero    ?? "",
        direccion: state.estudiante.direccion ?? "",
        correo:    state.estudiante.correo    ?? "",
        telefono:  state.estudiante.telefono  ?? "",
      }
    : FORM_VACIO;

  const [form,      setForm]      = useState(inicial);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = e => {
    let { name, value } = e.target;
    if (["nombres", "apellidos", "direccion"].includes(name)) value = value.toUpperCase();
    if (name === "correo") value = value.toLowerCase();
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      esEdicion ? await actualizarEstudiante(id, form) : await crearEstudiante(form);
      navigate(`/${slug}/estudiantes`);
    } catch (err) {
      const msg = err?.response?.data?.mensaje ?? err?.response?.data?.message ?? "Error al guardar.";
      setFormError(msg);
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-2">

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() =>navigate(`/${slug}/estudiantes`)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <p className="text-sm text-gray-400">
          {esEdicion ? "Modifica los datos del estudiante" : "Completa los datos para registrar un estudiante"}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="px-6 py-6">

          {formError && (
            <div className="mb-5 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Nombres"   name="nombres"   value={form.nombres}   onChange={handleChange} required />
            <Field label="Apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} required />
            <Field label="Documento" name="documento" value={form.documento} onChange={handleChange} required />

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Género
              </label>
              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white"
              >
                <option value="">Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>

            <Field label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} required />
            <Field label="Correo"    name="correo"    type="email" value={form.correo} onChange={handleChange} required />
            <Field label="Teléfono"  name="telefono"  value={form.telefono}  onChange={handleChange} />
          </div>

          <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {esEdicion ? "Actualizar" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() =>navigate(`/${slug}/estudiantes`)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-300"
      />
    </div>
  );
}