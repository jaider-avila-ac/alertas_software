import { useState, useContext } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import logo from "../assets/alertas-logo.png";
import { InputElegante } from "../components/InputElegante";
import { Button } from "../components/Button";
import { Notificacion } from "../components/Notificacion";
import { loginUsuario } from "../services/usuarioService";
import { UserContext } from "../context/UserContext"; // 👈 Asegúrate de que esté bien importado

export const PageLogin = () => {
  const [cedula, setCedula] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [error, setError] = useState(null);
  const { setUsuario } = useContext(UserContext); // 👈 Usamos el contexto

  const manejarLogin = async () => {
    if (!cedula.trim() || !contrasena.trim()) {
      setError("Por favor, ingrese cédula y contraseña.");
      return;
    }

    const credenciales = {
      cedula: cedula.trim(),
      password: contrasena.trim(),
    };

    console.log("📤 Datos enviados:", credenciales);

    try {
      const response = await loginUsuario(credenciales);
      const data = response.data;

      console.log("✅ Login exitoso:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data));

      // ✅ Guardamos en el contexto
      setUsuario({
        id: data.id,
        nombre: data.nombres,
        rol: data.rol,
      });

      window.location.href = "/";
    } catch (err) {
      console.warn("❌ Error al iniciar sesión:", err?.response?.data || err.message);
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      setError("Cédula o contraseña incorrecta.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-500">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h2 className="text-center text-xl font-semibold mb-6">Iniciar sesión</h2>

        {error && <Notificacion texto={error} color="bg-red-600" icono={EyeOff} />}

        <InputElegante
          label="Número de documento"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          placeholder="Ingrese su número de documento"
        />

        <div className="mb-4 w-full">
          <label className="block text-sm text-gray-700 mb-1">Contraseña</label>
          <div className="relative">
            <input
              type={mostrarClave ? "text" : "password"}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent pr-10"
            />
            <button
              type="button"
              onClick={() => setMostrarClave(!mostrarClave)}
              className="absolute right-0 top-1 text-gray-600"
            >
              {mostrarClave ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <Button text="Ingresar" color="bg-blue-600" icon={LogIn} onClick={manejarLogin} />
      </div>
    </div>
  );
};
