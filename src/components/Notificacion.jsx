import { useEffect, useState } from "react";

export const Notificacion = ({ texto, color = "bg-red-500", icono: Icon }) => {
  const [visible, setVisible] = useState(true);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hovering) {
        setVisible(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [hovering]);

  if (!visible) return null;

  return (
    <div
      className={`flex items-center gap-2 ${color} text-white px-4 py-2 rounded shadow mb-4 transition-opacity duration-300`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {Icon && <Icon size={20} />}
      <span>{texto}</span>
    </div>
  );
};
