import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState({
    id: null,         // ID de la persona (docente, estudiante, etc.)
    idUsuario: null,  // Nuevo campo para el ID de la tabla usuarios
    nombre: "",
    rol: null,
  });

  useEffect(() => {
    const data = localStorage.getItem("usuario");
    if (data) {
      const parsed = JSON.parse(data);
      setUsuario({
        id: parsed.personaId || null,      // Se usa como ID de la persona
        idUsuario: parsed.id || null,      // ID de la tabla usuarios
        nombre: parsed.nombres || parsed.nombre || "",
        rol: parsed.rol,
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};
