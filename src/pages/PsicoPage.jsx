import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { obtenerTodosPsicos } from "../services/psicoService";
import { generarUsuarioPsicorientador, generarUsuariosPsicorientadoresMasivo } from "../services/usuarioService";

import { Layout } from "../layout/Layout";
import { Button } from "../components/Button";
import { Table } from "../components/Table";
import { Buscador } from "../components/Buscador";
import { ModalBase } from "../components/ModalBase";
import { Notificacion } from "../components/Notificacion";

import { Pencil, Plus, UserPlus } from "lucide-react";
import { UserContext } from "../context/UserContext";

export const PsicoPage = () => {
  const [psicos, setPsicos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 15;
  const { usuario } = useContext(UserContext);
  const navigate = useNavigate();

  const [modalMasivo, setModalMasivo] = useState(false);
  const [modalIndividual, setModalIndividual] = useState({ visible: false, cedula: "" });
  const [noti, setNoti] = useState({ visible: false, texto: "", color: "" });

  useEffect(() => {
    if (usuario.rol === 3) cargarPsicos();
  }, [usuario, location]);

  const cargarPsicos = async () => {
    try {
      const res = await obtenerTodosPsicos();
      setPsicos(res.data);
    } catch (error) {
      console.error("Error al cargar psicorientadores:", error);
    }
  };

  const psicosFiltrados = psicos.filter((p) =>
    `${p.nombres} ${p.apellidos} ${p.nroDoc}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(psicosFiltrados.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const visibles = psicosFiltrados.slice(inicio, inicio + porPagina);

  const cambiarPagina = (nueva) => {
    if (nueva >= 1 && nueva <= totalPaginas) setPagina(nueva);
  };

  const datosTabla = visibles.map((p) => ({
    Nombre: `${p.nombres} ${p.apellidos}`,
    Documento: p.nroDoc,
    Correo: p.correo || "-",
    Acciones: (
      <div className="flex gap-2">
        <Button
          icon={Pencil}
          title="Editar"
          color="bg-yellow-500"
          onClick={() => navigate(`/formulario-psico/${p.id}`)}
        />
        {!p.usuario && (
          <Button
            icon={UserPlus}
            title="Generar usuario"
            color="bg-green-700"
            onClick={() => setModalIndividual({ visible: true, cedula: p.nroDoc })}
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
          <h2 className="text-2xl font-bold">Psicorientadores</h2>
          <div className="flex gap-2">
            <Button
              text="Agregar psico"
              icon={Plus}
              color="bg-blue-600"
              onClick={() => navigate("/formulario-psico")}
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
          <Button text="Buscar" color="bg-sky-500" onClick={() => setPagina(1)} />
        </div>

        <Table columns={["Nombre", "Documento", "Correo", "Acciones"]} data={datosTabla} />

        <div className="flex justify-between items-center mt-4">
          <Button text="Anterior" color="bg-gray-400" onClick={() => cambiarPagina(pagina - 1)} />
          <span>Página {pagina} de {totalPaginas}</span>
          <Button text="Siguiente" color="bg-gray-400" onClick={() => cambiarPagina(pagina + 1)} />
        </div>

   
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
                  cargarPsicos();
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
                  cargarPsicos();
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
    </Layout>
  );
};
