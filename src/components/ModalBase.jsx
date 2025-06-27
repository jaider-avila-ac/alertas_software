import { useEffect, useState } from "react";

export const ModalBase = ({ visible, onClose, children, ancho = "max-w-md" }) => {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    if (visible) {
      setTimeout(() => setMostrar(true), 10);
    } else {
      setMostrar(false);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
      <div
        className={`relative bg-white p-6 rounded-xl shadow-2xl w-full ${ancho} z-10 transition-all duration-300 transform pointer-events-auto ${
          mostrar ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {children}
      </div>
    </div>
  );
};
