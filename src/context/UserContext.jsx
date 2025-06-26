import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState({
    id: 1, // ✅ ID del psicorientador (ajústalo si necesitas otro valor)
    nombre: "Usuario Demo",
    rol: 0, //  0 (docente) y 2 (psicorientador)
  });

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};
