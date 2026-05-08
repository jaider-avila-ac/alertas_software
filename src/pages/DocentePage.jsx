import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { obtenerTodosDocentes } from "../services/docenteService";
import { generarUsuarioDocente, generarUsuariosDocentesMasivo } from "../services/usuarioService";

import DataTable from "../components/ui/DataTable";
import { Button } from "../components/Button";
import { ModalBase } from "../components/ModalBase";
import { Notificacion } from "../components/Notificacion";

import { Pencil, Plus, UserPlus } from "lucide-react";
import { UserContext } from "../context/UserContext";

const COLUMNS = [
  { key: "nroDoc",  label: "Documento" },
  { key: "nombre",  label: "Nombre"    },
  { key: "correo",  label: "Correo"    },
];

export const DocentePage = () => {
  const [docentes, setDocentes]           = useState([]);
  const [cargando, setCargando]           = useState(true);
  const [modalMasivo, setModalMasivo]     = useState(false);
  const [modalIndividual, setModalIndividual] = useState({ visible: false, cedula: "" });
  const [noti, setNoti]                   = useState({ visible: false, texto: "", color: "" });

  const { usuario } = useContext(UserContext);
  const navigate    = useNavigate();
  const location    = useLocation();

  useEffect(() => {
    if (usuario?.rol === 3) cargarDocentes();
  }, [usuario, location]);

  const cargarDocentes = async () => {
    setCargando(true);
    try {
      const res = await obtenerTodosDocentes();
      setDocentes(
        res.data.map((d) => ({
          ...d,
          nombre: `${d.nombres} ${d.apellidos}`,
          correo: d.correo || "—",
        }))
      );
    } catch (error) {
      console.error("Error al cargar docentes:", error);
    } finally {
      setCargando(false);
    }
  };

  if (usuario.rol !== 3) {
    return (
      <main className="flex-1 p-4">
        <h2 className="text-xl font-semibold">Acceso restringido</h2>
        <p>Solo los administradores pueden acceder a esta sección.</p>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Docentes</h2>
        <div className="flex gap-2">
          <Button
            text="Agregar docente"
            icon={Plus}
            color="bg-pink-500"
            onClick={() => navigate("/formulario-docente")}
          />
          <Button
            text="Generar usuarios"
            color="bg-green-600"
            onClick={() => setModalMasivo(true)}
          />
        </div>
      </div>

      <DataTable
        columns={COLUMNS}
        rows={docentes}
        loading={cargando}
        searchKeys={["nroDoc", "nombre"]}
        actions={(row) => (
          <>
            <Button
              icon={Pencil}
              title="Editar"
              color="bg-yellow-500"
              onClick={() => navigate(`/formulario-docente/${row.id}`)}
            />
            {!row.usuario && (
              <Button
                icon={UserPlus}
                title="Generar usuario"
                color="bg-green-700"
                onClick={() => setModalIndividual({ visible: true, cedula: row.nroDoc })}
              />
            )}
          </>
        )}
      />

      <ModalBase visible={modalMasivo} onClose={() => setModalMasivo(false)}>
        <h3 className="text-xl font-semibold mb-4">
          ¿Generar usuarios para todos los docentes sin usuario?
        </h3>
        <div className="flex justify-end gap-2 mt-4">
          <Button text="Cancelar" color="bg-gray-500" onClick={() => setModalMasivo(false)} />
          <Button
            text="Generar"
            color="bg-green-600"
            onClick={async () => {
              try {
                await generarUsuariosDocentesMasivo();
                setModalMasivo(false);
                cargarDocentes();
                setNoti({ visible: true, texto: "Usuarios generados correctamente", color: "green" });
              } catch (err) {
                setNoti({ visible: true, texto: "Error al generar usuarios", color: "red" });
                console.error(err);
              }
            }}
          />
        </div>
      </ModalBase>

      <ModalBase
        visible={modalIndividual.visible}
        onClose={() => setModalIndividual({ visible: false, cedula: "" })}
      >
        <h3 className="text-xl font-semibold mb-4">
          ¿Generar usuario para cédula {modalIndividual.cedula}?
        </h3>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            text="Cancelar"
            color="bg-gray-500"
            onClick={() => setModalIndividual({ visible: false, cedula: "" })}
          />
          <Button
            text="Confirmar"
            color="bg-green-600"
            onClick={async () => {
              try {
                await generarUsuarioDocente(modalIndividual.cedula);
                setModalIndividual({ visible: false, cedula: "" });
                cargarDocentes();
                setNoti({ visible: true, texto: "Usuario generado correctamente", color: "green" });
              } catch (err) {
                setNoti({ visible: true, texto: "Error al generar usuario", color: "red" });
                console.error(err);
              }
            }}
          />
        </div>
      </ModalBase>

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
