import { createContext, useState } from "react";

// Crear contexto
export const UserContext = createContext();

// Proveedor de contexto
export const UserProvider = ({ children }) => {
  // Aquí puedes cambiar manualmente entre roles:
  // 0 = Docente, 2 = Psicorientador
  const [usuario, setUsuario] = useState({
    nombre: "Usuario Demo",
    rol: 2, // ⬅️ CAMBIA AQUÍ entre 0 (docente) y 2 (psicorientador)
  });

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};
