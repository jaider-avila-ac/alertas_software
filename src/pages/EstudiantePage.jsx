import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Button } from "../components/Button";
import { Notificacion } from "../components/Notificacion";

import { Plus } from "lucide-react";
import { UserContext } from "../context/UserContext";

import { useEstudiantes } from "../components/estudiantes/useEstudiantes";
import { TablaEstudiantes } from "../components/estudiantes/TablaEstudiantes";
import { ModalesEstudiantes } from "../components/estudiantes/ModalesEstudiantes";

export const EstudiantePage = () => {
  const { usuario } = useContext(UserContext);
  const location    = useLocation();
  const navigate    = useNavigate();

  const [modalMasivo,    setModalMasivo]    = useState(false);
  const [modalIndividual, setModalIndividual] = useState({ visible: false, cedula: "" });
  const [noti, setNoti]                     = useState({ visible: false, texto: "", color: "" });

  const soloConSeguimiento =
    location.pathname === "/seguimientos" ||
    (location.pathname === "/estudiantes" && usuario?.rol === 2);

  const { estudiantes, fotos, cargando, recargar } = useEstudiantes({ soloConSeguimiento });

  useEffect(() => {
    if (usuario?.id) recargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, usuario?.id]);

  if (!usuario || ![0, 2, 3].includes(usuario?.rol)) {
    return (
      <main className="flex-1 p-4">
        <h2 className="text-xl font-semibold">Acceso restringido</h2>
        <p>No tiene permisos para acceder a esta sección.</p>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Estudiantes</h2>
        {usuario.rol === 3 && (
          <div className="flex gap-2">
            <Button
              text="Agregar estudiante"
              icon={Plus}
              color="bg-pink-500"
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

      <TablaEstudiantes
        estudiantes={estudiantes}
        fotos={fotos}
        setModalIndividual={setModalIndividual}
        loading={cargando}
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
