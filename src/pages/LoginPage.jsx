import { useState } from "react";
import { Button } from "../components/Button";
import logo from "../assets/alertas-logo.png";
import { Eye, EyeOff } from "lucide-react";
import { usuarios } from "../data/usuarios";
import { useNavigate } from "react-router-dom";

export const LoginPage = ({ setUsuario }) => {
  const [cc, setCc] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleLogin = () => {
    const encontrado = usuarios.find(
      (u) => u.cc === cc && u.password === password
    );

    if (encontrado) {
      setUsuario(encontrado);
      navigate("/");
    } else {
      setError("Cédula o contraseña incorrecta");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded shadow-md p-8 w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h1 className="text-center text-xl font-bold text-pink-500">Iniciar sesión</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm block mb-1">Cédula (CC/TI)</label>
            <input
              type="text"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              className="w-full border-b-2 border-pink-500 focus:outline-none focus:border-pink-700 bg-transparent"
              placeholder="Ingrese su documento"
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm block mb-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b-2 border-pink-500 focus:outline-none focus:border-pink-700 bg-transparent pr-10"
                placeholder="Ingrese su contraseña"
              />
              <div
                onClick={toggleShowPassword}
                className="absolute right-2 top-2.5 text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <div className="text-right text-sm">
            <a href="#" className="text-pink-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button text="Iniciar sesión" color="bg-pink-500" onClick={handleLogin} />
        </div>
      </div>
    </div>
  );
};
