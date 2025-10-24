import { useEffect, useState } from "react";
import { crearSugerencia, obtenerTodasSugerencias } from "../services/sugerenciaService";
import { Plus, X } from "lucide-react";

export const ToDoFlotante = () => {
  const [visible, setVisible] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  const cargarSugerencias = async () => {
    try {
      const data = await obtenerTodasSugerencias();
      const lista = Array.isArray(data) ? data : [];
      lista.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setSugerencias(lista);
    } catch {}
  };

  const manejarEnviar = async () => {
    if (!nuevoMensaje.trim()) return;
    try {
      await crearSugerencia({ mensaje: nuevoMensaje });
      setNuevoMensaje("");
      cargarSugerencias();
    } catch {}
  };

  const manejarToggleVisible = () => {
    const nuevoEstado = !visible;
    setVisible(nuevoEstado);
    if (!nuevoEstado) return;
    cargarSugerencias();
  };

  return (
    <>
      <button
        onClick={manejarToggleVisible}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
        title="Sugerencias"
      >
        {visible ? <X size={20} /> : <Plus size={20} />}
      </button>

      {visible && (
        <div className="fixed bottom-20 right-4 w-80 h-[80vh] bg-white border rounded shadow-lg p-4 z-50 flex flex-col space-y-2">
          <h3 className="text-lg font-semibold">Sugerencias</h3>

          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
            <p className="mb-1 font-medium">Puntos clave para verificar:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Seguridad (datos sensibles, rutas protegidas)</li>
              <li>Responsividad en móviles y tablets</li>
              <li>Fluidez en la carga de datos</li>
              <li>Claridad y estructura del diseño</li>
              <li>Accesibilidad de botones e inputs</li>
              <li>Mensajes de error claros</li>
              <li>Flujo de usuario intuitivo</li>
              <li>Tiempo de respuesta al hacer acciones</li>
              <li>Consistencia visual entre secciones</li>
            </ul>
          </div>

          <textarea
            rows={3}
            placeholder="Escribe una sugerencia o error..."
            className="w-full border rounded p-2 text-sm"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
          />

          <button
            onClick={manejarEnviar}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded"
          >
            Enviar
          </button>

          <hr />

          <div className="flex-1 overflow-y-auto space-y-2 text-sm border rounded p-2">
            {sugerencias.length === 0 ? (
              <p className="text-gray-500 italic">Sin sugerencias aún.</p>
            ) : (
              sugerencias.map((s) => (
                <div
                  key={s.id}
                  className="p-2 border rounded bg-gray-50 text-gray-800"
                >
                  <p>{s.mensaje}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(s.fecha).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};
