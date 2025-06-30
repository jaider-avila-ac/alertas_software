import { useContext, useRef, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { DatoCampo } from "../components/DatoCampo";
import { Button } from "../components/Button";
import { Layout } from "../layout/Layout";
import { Image, Lock, LogOut, Eye, EyeOff } from "lucide-react";
import MarcoBorde from "../assets/fotos_estudiante/marco_borde.png";
import FotoPorDefecto from "../assets/fotos_estudiante/CARD_PERFIL.jpg";
import { obtenerDocentePorId } from "../services/docenteService";
import { obtenerUsuarioPorId, cambiarContrasena } from "../services/usuarioService";
import {
  obtenerImagenEstudiante,
  obtenerEstudiantePorId,
  subirImagenEstudiante,
} from "../services/estudianteService";

export const PerfilPage = () => {
  const { usuario, setUsuario } = useContext(UserContext);
  const [datosUsuarioPerfil, setDatosUsuarioPerfil] = useState(null);
  const [imagenUrl, setImagenUrl] = useState(FotoPorDefecto);
  const [imagenBlobUrl, setImagenBlobUrl] = useState(null);
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [contrasenaConfirmar, setContrasenaConfirmar] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);
  const inputRef = useRef();

  const tipoInput = verContrasena ? "text" : "password";
  const IconoVista = verContrasena ? EyeOff : Eye;

  const obtenerNombreRol = (rol) => {
    switch (rol) {
      case 0: return "Docente";
      case 1: return "Estudiante";
      case 2: return "Psicorientador";
      case 3: return "Administrador";
      default: return "Desconocido";
    }
  };

  const cerrarSesion = () => {
    setUsuario(null);
    console.log("Sesión cerrada");
  };

  const cargarImagen = (id) => {
    obtenerImagenEstudiante(id)
      .then((res) => {
        if (res?.data && res.data.size > 0) {
          if (imagenBlobUrl) {
            URL.revokeObjectURL(imagenBlobUrl);
          }
          const nuevaUrl = URL.createObjectURL(res.data);
          setImagenBlobUrl(nuevaUrl);
          setImagenUrl(nuevaUrl);
        } else {
          setImagenUrl(FotoPorDefecto);
        }
      })
      .catch(() => setImagenUrl(FotoPorDefecto));
  };

  const manejarCambioFoto = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo || !usuario?.id) return;
    try {
      await subirImagenEstudiante(usuario.id, archivo);
      await cargarImagen(usuario.id);
    } catch (error) {
      console.error("Error al subir imagen:", error);
    }
  };

  useEffect(() => {
    if (!usuario?.id) return;

    if (usuario.rol === 1) {
      obtenerEstudiantePorId(usuario.id)
        .then((res) => setDatosUsuarioPerfil(res.data))
        .catch((err) => console.error("Error al obtener estudiante:", err));
      cargarImagen(usuario.id);
    } else if (usuario.rol === 0) {
      obtenerDocentePorId(usuario.id)
        .then((res) => setDatosUsuarioPerfil(res.data))
        .catch((err) => console.error("Error al obtener docente:", err));
    } else if (usuario.rol === 3) {
      obtenerUsuarioPorId(usuario.id)
        .then((res) => setDatosUsuarioPerfil(res.data))
        .catch((err) => console.error("Error al obtener usuario:", err));
    }

    return () => {
      if (imagenBlobUrl) URL.revokeObjectURL(imagenBlobUrl);
    };
  }, [usuario]);

  return (
    <Layout>
      <div className="flex justify-end mb-4">
        <Button
          text="Cerrar Sesión"
          icon={LogOut}
          color="bg-red-600"
          title="Cerrar sesión"
          onClick={cerrarSesion}
        />
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Perfil de Usuario</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {usuario.rol === 1 && (
            <div className="flex items-center justify-center">
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
                    src={imagenUrl}
                    alt="Foto estudiante"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                </div>
                <Button
                  text="Cambiar Foto"
                  icon={Image}
                  color="bg-blue-600"
                  title="Actualizar foto de perfil"
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
          )}

          <div className="grid grid-cols-1 gap-4 w-full">
            <DatoCampo label="Rol del Usuario" value={obtenerNombreRol(usuario.rol)} />
            {datosUsuarioPerfil && (
              <>
                <DatoCampo label="Nombres" value={datosUsuarioPerfil.nombres} />
                <DatoCampo label="Cédula" value={datosUsuarioPerfil.cedula || datosUsuarioPerfil.nroDoc} />
                <DatoCampo label="Correo" value={datosUsuarioPerfil.correo || "Sin correo"} />
              </>
            )}
            {usuario.rol === 3 && datosUsuarioPerfil?.institucion && (
              <>
                <DatoCampo label="Institución" value={datosUsuarioPerfil.institucion.nombre} />
                <DatoCampo label="Código DANE" value={datosUsuarioPerfil.institucion.codigoDane} />
                <DatoCampo label="Dirección" value={datosUsuarioPerfil.institucion.direccion} />
                <DatoCampo label="Teléfono" value={datosUsuarioPerfil.institucion.telefono} />
              </>
            )}
          </div>
        </div>

        <div className="mt-8 border border-gray-300 rounded p-4 max-w-md">
          <h2 className="text-lg font-semibold mb-4">Cambiar Contraseña</h2>
          <div className="flex flex-col gap-4">
            {[
              { label: "Contraseña Actual", value: contrasenaActual, setValue: setContrasenaActual },
              { label: "Nueva Contraseña", value: contrasenaNueva, setValue: setContrasenaNueva },
              { label: "Confirmar Nueva Contraseña", value: contrasenaConfirmar, setValue: setContrasenaConfirmar },
            ].map(({ label, value, setValue }) => (
              <div key={label} className="relative w-full">
                <label className="text-sm text-gray-600 font-medium mb-1 block">{label}</label>
                <input
                  type={tipoInput}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setVerContrasena(!verContrasena)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-800"
                  title="Mostrar/Ocultar contraseña"
                >
                  <IconoVista size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button
              text="Cambiar Contraseña"
              icon={Lock}
              color="bg-gray-800"
              title="Actualizar contraseña"
              onClick={() => console.log("Actualizar contraseña")}
              disabled={!contrasenaActual || !contrasenaNueva || !contrasenaConfirmar}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};
