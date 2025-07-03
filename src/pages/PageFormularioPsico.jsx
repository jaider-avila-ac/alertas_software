import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  obtenerPsicoPorId,
  crearPsico,
  actualizarPsico,
} from "../services/psicoService";
import { Layout } from "../layout/Layout";
import { Button } from "../components/Button";

const tiposDoc = ["TI", "CC"];

export const PageFormularioPsico = () => {
  const { id } = useParams();
  const editar = !!id;
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    tipoDoc: "",
    nroDoc: "",
    nombres: "",
    apellidos: "",
    correo: "",
  });

  useEffect(() => {
    if (editar) {
      obtenerPsicoPorId(id).then((res) => {
        const datos = res.data;
        setFormulario({
          tipoDoc: datos.tipoDoc || "",
          nroDoc: datos.nroDoc || "",
          nombres: datos.nombres || "",
          apellidos: datos.apellidos || "",
          correo: datos.correo || "",
        });
      });
    }
  }, [id]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const manejarGuardar = async () => {
    try {
      if (editar) {
        await actualizarPsico(id, formulario);
      } else {
        await crearPsico(formulario);
      }
      navigate("/psicos");
    } catch (error) {
      alert("Error al guardar psicorientador");
      console.error(error);
    }
  };

  return (
    <main>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">
          {editar ? "Editar Psicorientador" : "Nuevo Psicorientador"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Tipo de documento */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 font-medium mb-1">Tipo de documento</label>
            <select
              name="tipoDoc"
              value={formulario.tipoDoc}
              onChange={manejarCambio}
              className="border px-3 py-2 rounded"
            >
              <option value="">-- Seleccionar --</option>
              {tiposDoc.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          {/* Número de documento */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 font-medium mb-1">Número de documento</label>
            <input
              type="text"
              name="nroDoc"
              value={formulario.nroDoc}
              onChange={manejarCambio}
              className="border px-3 py-2 rounded"
            />
          </div>

          {/* Nombres */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 font-medium mb-1">Nombres</label>
            <input
              type="text"
              name="nombres"
              value={formulario.nombres}
              onChange={manejarCambio}
              className="border px-3 py-2 rounded"
            />
          </div>

          {/* Apellidos */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 font-medium mb-1">Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={formulario.apellidos}
              onChange={manejarCambio}
              className="border px-3 py-2 rounded"
            />
          </div>

          {/* Correo */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 font-medium mb-1">Correo</label>
            <input
              type="email"
              name="correo"
              value={formulario.correo || ""}
              onChange={manejarCambio}
              className="border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button text="Guardar" color="bg-green-600" onClick={manejarGuardar} />
          <Button text="Cancelar" color="bg-gray-600" onClick={() => navigate("/psicos")} />
        </div>
      </div>
    </main>
  );
};
