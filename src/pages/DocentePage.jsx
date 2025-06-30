import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerTodosDocentes } from "../services/docenteService";

import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { Buscador } from "../components/Buscador";
import { Layout } from "../layout/Layout";
import { ModalBase } from "../components/ModalBase";
import { Notificacion } from "../components/Notificacion";

import { Pencil, Plus, UserPlus } from "lucide-react";
import { UserContext } from "../context/UserContext";
import {
  generarUsuarioDocente,
  generarUsuariosDocentesMasivo,
} from "../services/usuarioService";

export const DocentePage = () => {
  const [docentes, setDocentes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 15;
  const { usuario } = useContext(UserContext);
  const navigate = useNavigate();

  const [modalMasivo, setModalMasivo] = useState(false);
  const [modalIndividual, setModalIndividual] = useState({ visible: false, cedula: "" });
  const [noti, setNoti] = useState({ visible: false, texto: "", color: "" });

  useEffect(() => {
    if (usuario.rol === 3) {
      cargarDocentes();
    }
  }, []);

  const cargarDocentes = async () => {
    try {
      const res = await obtenerTodosDocentes();
      setDocentes(res.data);
    } catch (error) {
      console.error("Error al cargar docentes:", error);
    }
  };

  const docentesFiltrados = docentes.filter((d) =>
    `${d.nombres} ${d.apellidos} ${d.nroDoc}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(docentesFiltrados.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const visibles = docentesFiltrados.slice(inicio, inicio + porPagina);

  const cambiarPagina = (nueva) => {
    if (nueva >= 1 && nueva <= totalPaginas) setPagina(nueva);
  };

  const datosTabla = visibles.map((d) => ({
    Documento: d.nroDoc,
    Nombre: `${d.nombres} ${d.apellidos}`,
    Correo: d.correo || "-",
    Acciones: (
      <div className="flex gap-2">
        <Button
          icon={Pencil}
          title="Editar"
          color="bg-yellow-500"
          onClick={() => navigate(`/formulario-docente/${d.id}`)}
        />
        {!d.usuario && (
          <Button
            title="Generar usuario"
            icon={UserPlus}
            color="bg-green-700"
            onClick={() =>
              setModalIndividual({ visible: true, cedula: d.nroDoc })
            }
          />
        )}
      </div>
    ),
  }));

  if (usuario.rol !== 3) {
    return (
      <Layout>
        <main className="flex-1 p-4">
          <h2 className="text-xl font-semibold">Acceso restringido</h2>
          <p>Solo los administradores pueden acceder a esta sección.</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-1 space-y-4 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Docentes</h2>
          <div className="flex gap-2">
            <Button
              text="Agregar docente"
              icon={Plus}
              color="bg-blue-600"
              onClick={() => navigate("/formulario-docente")}
            />
            <Button
              text="Generar usuarios"
              color="bg-green-600"
              onClick={() => setModalMasivo(true)}
            />
          </div>
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

        <Table
          columns={["Documento", "Nombre", "Correo", "Acciones"]}
          data={datosTabla}
        />

        <div className="flex justify-between items-center mt-4">
          <Button
            text="Anterior"
            color="bg-gray-400"
            onClick={() => cambiarPagina(pagina - 1)}
          />
          <span>Página {pagina} de {totalPaginas}</span>
          <Button
            text="Siguiente"
            color="bg-gray-400"
            onClick={() => cambiarPagina(pagina + 1)}
          />
        </div>

        {/* MODAL MASIVO */}
        <ModalBase visible={modalMasivo} onClose={() => setModalMasivo(false)}>
          <h3 className="text-xl font-semibold mb-4">
            ¿Generar usuarios para todos los docentes sin usuario?
          </h3>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              text="Cancelar"
              color="bg-gray-500"
              onClick={() => setModalMasivo(false)}
            />
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

        {/* MODAL INDIVIDUAL */}
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

        {/* NOTIFICACIÓN */}
        {noti.visible && (
          <Notificacion
            texto={noti.texto}
            color={noti.color}
            onClose={() => setNoti({ ...noti, visible: false })}
          />
        )}
      </main>
    </Layout>
  );
};
