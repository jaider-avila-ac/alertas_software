import { useState, useContext } from "react";
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
  const [pagina, setPagina] = useState(1);

  const [modalMasivo, setModalMasivo] = useState(false);
  const [modalIndividual, setModalIndividual] = useState({ visible: false, cedula: "" });
  const [noti, setNoti] = useState({ visible: false, texto: "", color: "" });

  const soloConSeguimiento =
    location.pathname === "/seguimientos" ||
    (location.pathname === "/estudiantes" && usuario?.rol === 2);

  const { estudiantes, fotos, cargando, recargar } = useEstudiantes({ soloConSeguimiento });

  const estudiantesFiltrados = estudiantes.filter((e) =>
    `${e.nombres} ${e.apellidos} ${e.nroDoc}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (![0, 2, 3].includes(usuario?.rol)) {
    return (

        <main className="flex-1 p-4">
          <h2 className="text-xl font-semibold">Acceso restringido</h2>
          <p>No tiene permisos para acceder a esta sección.</p>
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
            onChange={(valor) => {
              setBusqueda(valor);
              setPagina(1);
            }}
            placeholder="Buscar por nombre o documento"
          />
          <Button
            text="Buscar"
            color="bg-sky-500"
            onClick={() => setPagina(1)}
          />
        </div>

        <TablaEstudiantes
          estudiantes={estudiantesFiltrados}
          fotos={fotos}
          pagina={pagina}
          porPagina={15}
          setPagina={setPagina}
          setModalIndividual={setModalIndividual}
        />

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
