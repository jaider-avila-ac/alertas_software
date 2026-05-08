import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { obtenerTodosPsicos } from "../services/psicoService";
import { generarUsuarioPsicorientador, generarUsuariosPsicorientadoresMasivo } from "../services/usuarioService";

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

let _cache = null;

const mapRow = (p) => ({
  ...p,
  nombre: `${p.nombres} ${p.apellidos}`,
  correo: p.correo || "—",
});

export const PsicoPage = () => {
  const [psicos, setPsicos]                   = useState(_cache ?? []);
  const [cargando, setCargando]               = useState(!_cache);
  const [modalMasivo, setModalMasivo]         = useState(false);
  const [modalIndividual, setModalIndividual] = useState({ visible: false, cedula: "" });
  const [noti, setNoti]                       = useState({ visible: false, texto: "", color: "" });

  const { usuario } = useContext(UserContext);
  const navigate    = useNavigate();
  const location    = useLocation();

  useEffect(() => {
    if (usuario?.rol !== 3) return;
    let active = true;

    obtenerTodosPsicos()
      .then((res) => {
        if (!active) return;
        const rows = res.data.map(mapRow);
        _cache = rows;
        setPsicos(rows);
      })
      .catch((err) => console.error("Error al cargar psicorientadores:", err))
      .finally(() => { if (active) setCargando(false); });

    return () => { active = false; };
  }, [usuario, location]);

  const refrescar = () => {
    obtenerTodosPsicos()
      .then((res) => {
        const rows = res.data.map(mapRow);
        _cache = rows;
        setPsicos(rows);
      })
      .catch((err) => console.error(err));
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
        <h2 className="text-2xl font-bold">Psicorientadores</h2>
        <div className="flex gap-2">
          <Button
            text="Agregar"
            icon={Plus}
            color="bg-pink-500"
            onClick={() => navigate("/formulario-psico")}
            hideTextOnMobile
          />
          <Button
            text="Generar usuarios"
            color="bg-green-600"
            onClick={() => setModalMasivo(true)}
            hideTextOnMobile
          />
        </div>
      </div>

      <DataTable
        columns={COLUMNS}
        rows={psicos}
        loading={cargando}
        searchKeys={["nroDoc", "nombre"]}
        actions={(row) => (
          <>
            <Button
              icon={Pencil}
              title="Editar"
              color="bg-yellow-500"
              onClick={() => navigate(`/formulario-psico/${row.id}`)}
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
          ¿Generar usuarios para todos los psicorientadores sin usuario?
        </h3>
        <div className="flex justify-end gap-2 mt-4">
          <Button text="Cancelar" color="bg-gray-500" onClick={() => setModalMasivo(false)} />
          <Button
            text="Generar"
            color="bg-green-600"
            onClick={async () => {
              try {
                await generarUsuariosPsicorientadoresMasivo();
                setModalMasivo(false);
                refrescar();
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
                await generarUsuarioPsicorientador(modalIndividual.cedula);
                setModalIndividual({ visible: false, cedula: "" });
                refrescar();
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
