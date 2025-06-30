import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  obtenerDocentePorId,
  crearDocente,
  actualizarDocente,
} from "../services/docenteService";
import { Layout } from "../layout/Layout";
import { Button } from "../components/Button";

const tiposDoc = ["TI", "CC"];

export const PageFormularioDocente = () => {
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
      obtenerDocentePorId(id).then((res) => {
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
      console.log("Enviando datos (PUT):", formulario);
      console.log("Endpoint:", `/api/docentes/${id}`);
      await actualizarDocente(id, formulario);
    } else {
      console.log("Enviando datos (POST):", formulario);
      console.log("Endpoint:", "/api/docentes");
      await crearDocente(formulario);
    }
    navigate("/docentes");
  } catch (error) {
    alert("Error al guardar docente");
    console.error("Error en petición:", error);
  }
};


  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">
          {editar ? "Editar Docente" : "Nuevo Docente"}
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
            <label className="text-sm text-gray-600 font-medium mb-1">Correo electrónico</label>
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
          <Button text="Cancelar" color="bg-gray-600" onClick={() => navigate("/docentes")} />
        </div>
      </div>
    </Layout>
  );
};
