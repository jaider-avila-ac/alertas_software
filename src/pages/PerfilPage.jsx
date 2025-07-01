import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Layout } from "../layout/Layout";
import { Button } from "../components/Button";
import { LogOut } from "lucide-react";
import { obtenerPsicoPorId } from "../services/psicoService";

import { obtenerEstudiantePorId, obtenerImagenEstudiante } from "../services/estudianteService";
import { obtenerDocentePorId } from "../services/docenteService";
import { obtenerUsuarioPorId } from "../services/usuarioService";

import { PerfilEstudiante } from "../components/perfil/PerfilEstudiante";
import { PerfilDocente } from "../components/perfil/PerfilDocente";
import { PerfilPsicorientador } from "../components/perfil/PerfilPsicorientador";
import { PerfilAdministrador } from "../components/perfil/PerfilAdministrador";

import { CambiarContrasena } from "../components/perfil/CambiarContrasena";

export const PerfilPage = () => {
  const { usuario, setUsuario } = useContext(UserContext);
  const navigate = useNavigate();

  const [datos, setDatos] = useState(null);
  const [imagenUrl, setImagenUrl] = useState(null);
  const [imagenBlobUrl, setImagenBlobUrl] = useState(null);

  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [contrasenaConfirmar, setContrasenaConfirmar] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/login");
  };

  const cargarImagen = async (id) => {
    try {
      const res = await obtenerImagenEstudiante(id);
      const blob = res.data;
      if (imagenBlobUrl) URL.revokeObjectURL(imagenBlobUrl);
      const nuevaUrl = URL.createObjectURL(blob);
      setImagenBlobUrl(nuevaUrl);
      setImagenUrl(nuevaUrl);
    } catch {
      setImagenUrl(null);
    }
  };

  useEffect(() => {
    if (!usuario?.id) return;

    const cargar = async () => {
      try {
        if (usuario.rol === 1) {
          const res = await obtenerEstudiantePorId(usuario.id);
          setDatos(res.data);
          await cargarImagen(usuario.id);
        } else if (usuario.rol === 0) {
          const res = await obtenerDocentePorId(usuario.id);
          setDatos(res.data);
        } else if (usuario.rol === 2) {
          const res = await obtenerPsicoPorId(usuario.id);
          setDatos(res.data);
        }
       else if (usuario.rol === 3) {
  const res = await obtenerUsuarioPorId(usuario.id);
  setDatos(res.data);
}
      } catch (error) {
        console.error("Error al cargar perfil", error);
      }
    };

    cargar();

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
          onClick={cerrarSesion}
        />
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Perfil de Usuario</h1>

        {usuario.rol === 1 && datos && (
          <PerfilEstudiante datos={datos} imagenUrl={imagenUrl} recargarImagen={cargarImagen} />
        )}
        {usuario.rol === 0 && datos && <PerfilDocente datos={datos} />}
        {usuario.rol === 2 && datos && <PerfilPsicorientador datos={datos} />}
           {usuario.rol === 3 && datos && <PerfilAdministrador datos={datos} />}

        <CambiarContrasena
          contrasenaActual={contrasenaActual}
          setContrasenaActual={setContrasenaActual}
          contrasenaNueva={contrasenaNueva}
          setContrasenaNueva={setContrasenaNueva}
          contrasenaConfirmar={contrasenaConfirmar}
          setContrasenaConfirmar={setContrasenaConfirmar}
          verContrasena={verContrasena}
          setVerContrasena={setVerContrasena}
          onActualizar={() => console.log("Actualizar contraseña")}
        />
      </div>
    </Layout>
  );
};
