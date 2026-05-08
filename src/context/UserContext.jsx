import { createContext, useState } from "react";

export const UserContext = createContext();

const cargarDesdeStorage = () => {
  try {
    const data = localStorage.getItem("usuario");
    if (!data) return { id: null, idUsuario: null, nombre: "", rol: null };
    const parsed = JSON.parse(data);
    return {
      id: parsed.personaId || null,
      idUsuario: parsed.id || null,
      nombre: parsed.nombres || parsed.nombre || "",
      rol: parsed.rol ?? null,
    };
  } catch {
    return { id: null, idUsuario: null, nombre: "", rol: null };
  }
};

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(cargarDesdeStorage);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};
