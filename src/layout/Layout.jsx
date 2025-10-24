import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToDoFlotante } from "../components/ToDoFlotante";


export const Layout = () => {
  const [ancho, setAncho] = useState(window.innerWidth);
  const esEscritorio = ancho >= 1024;

  useEffect(() => {
    const manejarResize = () => setAncho(window.innerWidth);
    window.addEventListener("resize", manejarResize);
    return () => window.removeEventListener("resize", manejarResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />

      <div className={`flex-1 flex flex-col ${esEscritorio ? "lg:ml-64" : ""}`}>
        {/* Header solo en escritorio */}
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Contenido central */}
        <main
          className={`flex-1 overflow-y-auto p-4 space-y-4 ${
            !esEscritorio ? "mt-16" : ""
          }`}
        >
          <Outlet />

          <ToDoFlotante />

        </main>
      </div>
    </div>
  );
};
