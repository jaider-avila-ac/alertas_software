import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState({
    id: 7, // ✅ ID del psicorientador (ajústalo si necesitas otro valor)
    nombre: "Usuario Demo",
    rol: 3, //  0 (docente) y 2 (psicorientador) 1 estudiante y 3 adminsitrador
  });

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};
