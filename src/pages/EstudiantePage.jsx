import { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Buscador } from "../components/Buscador";
import { Button } from "../components/Button";
import { Notificacion } from "../components/Notificacion";

import { Plus } from "lucide-react";
import { UserContext } from "../context/UserContext";

import { useEstudiantes } from "../components/estudiantes/useEstudiantes";
import { TablaEstudiantes } from "../components/estudiantes/TablaEstudiantes";
import { ModalesEstudiantes } from "../components/estudiantes/ModalesEstudiantes";

export const EstudiantePage = () => {
  const { usuario } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState("");
  const [pagina, setPagina] = useState(1);

  const [modalMasivo, setModalMasivo] = useState(false);
  const [modalIndividual, setModalIndividual] = useState({ visible: false, cedula: "" });
  const [noti, setNoti] = useState({ visible: false, texto: "", color: "" });

  const soloConSeguimiento =
    location.pathname === "/seguimientos" ||
    (location.pathname === "/estudiantes" && usuario?.rol === 2);

  const { estudiantes, fotos, cargando, recargar } = useEstudiantes({ soloConSeguimiento });

  // Recargar solo cuando cambie la ruta
  useEffect(() => {
    if (usuario?.id) {
      recargar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, usuario?.id]);

  // ✅ Debounce para la búsqueda
  useEffect(() => {
    const timeout = setTimeout(() => {
      setBusquedaActiva(busqueda);
      setPagina(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [busqueda]);

  // ✅ Normalizar texto (sin acentos, minúsculas)
  const normalizarTexto = (texto) => {
    if (!texto) return "";
    return String(texto)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // ✅ Filtrar estudiantes con useMemo
  const estudiantesFiltrados = useMemo(() => {
    try {
      if (!Array.isArray(estudiantes)) return [];
      
      const textoBusqueda = normalizarTexto(busquedaActiva);
      
      if (!textoBusqueda) {
        return estudiantes;
      }

      return estudiantes.filter((estudiante) => {
        if (!estudiante) return false;
        
        const nombres = normalizarTexto(estudiante.nombres || "");
        const apellidos = normalizarTexto(estudiante.apellidos || "");
        const nombreCompleto = `${nombres} ${apellidos}`.trim();

        return nombreCompleto.includes(textoBusqueda);
      });
    } catch (error) {
      console.error("Error al filtrar estudiantes:", error);
      return estudiantes || [];
    }
  }, [estudiantes, busquedaActiva]);

  // ✅ Verificar si está buscando (el debounce aún no terminó)
  const estaBuscando = busqueda !== busquedaActiva;

  // Verificar permisos
  if (!usuario || ![0, 2, 3].includes(usuario?.rol)) {
    return (
      <main className="flex-1 p-4">
        <h2 className="text-xl font-semibold">Acceso restringido</h2>
        <p>No tiene permisos para acceder a esta sección.</p>
      </main>
    );
  }

  // Mostrar indicador de carga inicial
  if (cargando && (!estudiantes || estudiantes.length === 0)) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estudiantes...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 space-y-4 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Estudiantes</h2>
        {usuario.rol === 3 && (
          <div className="flex gap-2">
            <Button
              text="Agregar estudiante"
              icon={Plus}
              color="bg-blue-600"
              onClick={() => navigate("/formulario-estudiante")}
            />
            <Button
              text="Generar usuarios"
              color="bg-green-600"
              onClick={() => setModalMasivo(true)}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Buscador
          valor={busqueda}
          onChange={(valor) => setBusqueda(valor)}
          placeholder="Buscar por nombre o apellido"
        />
        {/* ✅ Solo mostrar cuando el debounce haya terminado */}
        {busquedaActiva && !estaBuscando && (
          <span className="text-sm text-gray-600 font-medium">
            {estudiantesFiltrados.length} resultado{estudiantesFiltrados.length !== 1 ? "s" : ""}
          </span>
        )}
        {/* ✅ Mostrar "Buscando..." mientras escribe */}
        {estaBuscando && busqueda && (
          <span className="text-sm text-gray-400 italic">
            Buscando...
          </span>
        )}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {estudiantesFiltrados.length === 0 && !cargando ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">
            {busquedaActiva.trim() 
              ? `No se encontraron estudiantes con "${busquedaActiva}"`
              : "No hay estudiantes registrados"}
          </p>
        </div>
      ) : (
        <TablaEstudiantes
          estudiantes={estudiantesFiltrados}
          fotos={fotos}
          pagina={pagina}
          porPagina={15}
          setPagina={setPagina}
          setModalIndividual={setModalIndividual}
        />
      )}

      <ModalesEstudiantes
        modalMasivo={modalMasivo}
        setModalMasivo={setModalMasivo}
        modalIndividual={modalIndividual}
        setModalIndividual={setModalIndividual}
        recargar={recargar}
        setNoti={setNoti}
      />

      {noti.visible && (
        <Notificacion
          texto={noti.texto}
          color={noti.color}
          onClose={() => setNoti({ ...noti, visible: false })}
        />
      )}
    </main>
  );
};