import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { crearGrado, actualizarGrado } from "../../services/grados.service";

export default function GradoFormPage() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const { state } = useLocation();

  const esEdicion = Boolean(id);
  const [nombre,    setNombre]    = useState(esEdicion ? (state?.grado?.nombre ?? "") : "");
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      esEdicion
        ? await actualizarGrado(id, { nombre })
        : await crearGrado({ nombre });
      navigate("/grados");
    } catch (err) {
      setFormError(err?.response?.data?.mensaje ?? "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-2">

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/grados")}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <p className="text-sm text-gray-400">
          {esEdicion ? "Modifica el nombre del grado" : "Ingresa el nombre del nuevo grado"}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="px-6 py-6">

          {formError && (
            <div className="mb-5 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {formError}
            </div>
          )}

          <div className="max-w-sm">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Nombre del grado
            </label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              autoFocus
              placeholder="Ej: Grado 10°"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-300"
            />
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
              onClick={() => navigate("/grados")}
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