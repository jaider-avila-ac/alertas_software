import { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo-alerta-color.svg";
import { Notificacion } from "../components/Notificacion";
import { loginUsuario } from "../services/usuarioService";
import { UserContext } from "../context/UserContext"; 

export const PageLogin = () => {
  const [cedula, setCedula] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [error, setError] = useState(null);
  const { setUsuario } = useContext(UserContext); 
  
  const manejarLogin = async () => {
    if (!cedula.trim() || !contrasena.trim()) {
      setError("Por favor, ingrese cédula y contraseña.");
      return;
    }

    const credenciales = {
      cedula: cedula.trim(),
      password: contrasena.trim(),
    };

    try {
      const response = await loginUsuario(credenciales);
      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data));

      setUsuario({
        id: data.id,
        nombre: data.nombres,
        rol: data.rol,
      });

      window.location.href = "/";
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      setError("Cédula o contraseña incorrecta.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 to-pink-600 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-lg">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo Alertas" className="h-20" />
        </div>
        
        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Iniciar sesión
        </h1>

        {/* Notificación de error */}
        {error && (
          <div className="mb-6">
            <Notificacion texto={error} color="bg-red-600" icono={EyeOff} />
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={(e) => { e.preventDefault(); manejarLogin(); }} className="space-y-6">
          
          {/* Campo Número de documento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Número de documento
            </label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Ingrese su número de documento"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={mostrarClave ? "text" : "password"}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Ingrese su contraseña"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800 pr-14"
              />
              <button
                type="button"
                onClick={() => setMostrarClave(!mostrarClave)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-500 cursor-pointer"
              >
                {mostrarClave ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          {/* Botón de ingresar */}
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg cursor-pointer mt-8"
          >
            Ingresar
          </button>
        </form>

      </div>
    </div>
  );
};