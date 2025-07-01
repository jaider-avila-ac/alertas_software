import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario")) || {
    nombre: "Usuario",
    rol: "Sin rol",
  };

  const obtenerNombreRol = (rol) => {
    switch (rol) {
      case 0:
        return "Docente";
      case 1:
        return "Estudiante";
      case 2:
        return "Psicorientador";
      case 3:
        return "Administrador";
      default:
        return "Desconocido";
    }
  };

  return (
    <header className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Sistema Escolar</h1>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">{usuario.nombres}</p>
          <p className="text-sm text-gray-300">
            Rol: {obtenerNombreRol(usuario.rol)}
          </p>
        </div>
      </div>
    </header>
  );
};
