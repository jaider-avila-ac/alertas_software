import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../Button";

export const CambiarContrasena = ({
  contrasenaActual,
  setContrasenaActual,
  contrasenaNueva,
  setContrasenaNueva,
  contrasenaConfirmar,
  setContrasenaConfirmar,
  verContrasena,
  setVerContrasena,
  onActualizar,
}) => {
  const tipoInput = verContrasena ? "text" : "password";
  const IconoVista = verContrasena ? EyeOff : Eye;

  const campos = [
    {
      label: "Contraseña Actual",
      value: contrasenaActual,
      setValue: setContrasenaActual,
    },
    {
      label: "Nueva Contraseña",
      value: contrasenaNueva,
      setValue: setContrasenaNueva,
    },
    {
      label: "Confirmar Nueva Contraseña",
      value: contrasenaConfirmar,
      setValue: setContrasenaConfirmar,
    },
  ];

  return (
    <div className="mt-8 border border-gray-300 rounded p-4 max-w-md">
      <h2 className="text-lg font-semibold mb-4">Cambiar Contraseña</h2>
      <div className="flex flex-col gap-4">
        {campos.map(({ label, value, setValue }) => (
          <div key={label} className="relative w-full">
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              {label}
            </label>
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
          onClick={onActualizar}
          disabled={
            !contrasenaActual || !contrasenaNueva || !contrasenaConfirmar
          }
        />
      </div>
    </div>
  );
};
