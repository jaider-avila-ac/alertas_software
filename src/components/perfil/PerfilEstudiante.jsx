import { useRef, useState, useContext } from "react";
import { DatoCampo } from "../DatoCampo";
import { Button } from "../Button";
import { ComboBox } from "../ComboBox";
import { Image } from "lucide-react";
import MarcoBorde from "../../assets/fotos_estudiante/marco_borde.png";
import FotoPorDefecto from "../../assets/fotos_estudiante/CARD_PERFIL.jpg";
import { subirImagenEstudiante, actualizarEstudiante } from "../../services/estudianteService";
import { UserContext } from "../../context/UserContext";

const opcionesGenero = ["Masculino", "Femenino", "Otro"];
const opcionesEstadoCivil = ["Casado", "Soltero", "Unión libre", "Ninguno"];
const opcionesEstrato = ["1", "2", "3", "4", "5", "6"];
const opcionesRh = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const PerfilEstudiante = ({ datos, imagenUrl, recargarImagen }) => {
  const inputRef = useRef();
  const { usuario } = useContext(UserContext);

  const [formulario, setFormulario] = useState(() => {
    const normalizar = (val, arr) => (arr.includes(val) ? val : "");
    return {
      genero: normalizar(datos.genero, opcionesGenero),
      fechaNac: datos.fechaNac || "",
      direccion: datos.direccion || "",
      barrio: datos.barrio || "",
      estrato: normalizar(datos.estrato, opcionesEstrato),
      sisben: datos.sisben || "",
      eps: datos.eps || "",
      rh: normalizar(datos.rh, opcionesRh),
      acudiente: datos.acudiente || "",
      tel: datos.tel || "",
      sms: datos.sms || "",
      correo: datos.correo || "",
      curso: datos.curso || "",
      estadoCivil: normalizar(datos.estadoCivil, opcionesEstadoCivil),
      tiempo: datos.tiempo || "",
      nroHnos: datos.nroHnos || "",
      tipoVivienda: datos.tipoVivienda || "",
    };
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async () => {
    try {
      await actualizarEstudiante(usuario.id, formulario);
      alert("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    }
  };

  const manejarCambioFoto = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo || !usuario?.id) return;
    try {
      await subirImagenEstudiante(usuario.id, archivo);
      await recargarImagen(usuario.id);
    } catch (error) {
      console.error("Error al subir imagen:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* FOTO + DATOS BÁSICOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* FOTO */}
        <div className="flex justify-center md:col-span-1">
          <div className="text-center">
            <div
              className="relative w-full max-w-[160px] aspect-[3/4] mx-auto mb-3 cursor-pointer hover:scale-105 transition"
              title="Haz clic para cambiar la foto"
              onClick={() => inputRef.current.click()}
            >
              <img
                src={MarcoBorde}
                alt="Marco"
                className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
              />
              <img
                src={imagenUrl || FotoPorDefecto}
                alt="Foto estudiante"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
            </div>
            <Button
              text="Cambiar Foto"
              icon={Image}
              color="bg-blue-600"
              onClick={() => inputRef.current.click()}
            />
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={manejarCambioFoto}
            />
          </div>
        </div>

        {/* DATOS CLAVE */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatoCampo label="Rol del Usuario" value="Estudiante" />
          <DatoCampo label="Tipo de Documento" value={datos.tipoDoc} />
          <DatoCampo label="Número de Documento" value={datos.nroDoc} />
          <DatoCampo label="Nombres" value={datos.nombres} />
          <DatoCampo label="Apellidos" value={datos.apellidos} />
        </div>
      </div>

      {/* DATOS COMPLETOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComboBox label="Género" valor={formulario.genero} onChange={(val) => setFormulario({ ...formulario, genero: val })} opciones={opcionesGenero} />
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
          <input
            type="date"
            name="fechaNac"
            value={formulario.fechaNac}
            onChange={manejarCambio}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Dirección</label>
          <input name="direccion" value={formulario.direccion} onChange={manejarCambio} className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Barrio</label>
          <input name="barrio" value={formulario.barrio} onChange={manejarCambio} className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
        </div>
        <ComboBox label="Estrato" valor={formulario.estrato} onChange={(val) => setFormulario({ ...formulario, estrato: val })} opciones={opcionesEstrato} />
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Nivel Sisbén</label>
          <input name="sisben" value={formulario.sisben} onChange={manejarCambio} className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">EPS</label>
          <input name="eps" value={formulario.eps} onChange={manejarCambio} className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
        </div>
        <ComboBox label="RH" valor={formulario.rh} onChange={(val) => setFormulario({ ...formulario, rh: val })} opciones={opcionesRh} />
        <ComboBox label="Estado Civil" valor={formulario.estadoCivil} onChange={(val) => setFormulario({ ...formulario, estadoCivil: val })} opciones={opcionesEstadoCivil} />
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Acudiente</label>
          <input name="acudiente" value={formulario.acudiente} onChange={manejarCambio} className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Teléfono Fijo</label>
          <input name="tel" value={formulario.tel} onChange={manejarCambio} className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
        </div>
        <DatoCampo label="Teléfono SMS" value={datos.sms} />
        <DatoCampo label="Correo" value={datos.correo} />
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Curso</label>
          <input name="curso" value={formulario.curso} onChange={manejarCambio} className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Tiempo en la institución</label>
          <input name="tiempo" value={formulario.tiempo} onChange={manejarCambio} className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Número de Hermanos</label>
          <input name="nroHnos" value={formulario.nroHnos} onChange={manejarCambio} className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Tipo de Vivienda</label>
          <input name="tipoVivienda" value={formulario.tipoVivienda} onChange={manejarCambio} className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
        </div>
      </div>

      <div className="pt-4">
        <Button text="Guardar Cambios" color="bg-green-600" onClick={guardarCambios} />
      </div>
    </div>
  );
};
