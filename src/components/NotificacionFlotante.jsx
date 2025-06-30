import { useEffect } from "react";

export const NotificacionFlotante = ({ mensaje, tipo = "exito", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colores = {
    exito: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 text-white px-4 py-2 rounded shadow-lg ${colores[tipo]}`}>
      {mensaje}
    </div>
  );
};
