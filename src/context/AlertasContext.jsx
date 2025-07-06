
import { createContext, useState } from "react";

export const AlertasContext = createContext();

export const AlertasProvider = ({ children }) => {
  const [alertas, setAlertas] = useState(null); 

  return (
    <AlertasContext.Provider value={{ alertas, setAlertas }}>
      {children}
    </AlertasContext.Provider>
  );
};
