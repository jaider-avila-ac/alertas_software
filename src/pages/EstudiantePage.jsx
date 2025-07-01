import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  obtenerTodosEstudiantes,
  obtenerImagenEstudiante,
} from "../services/estudianteService";
import { obtenerEstudiantesConSeguimientos } from "../services/seguimientoService";

import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { Buscador } from "../components/Buscador";
import { Layout } from "../layout/Layout";
import { ModalBase } from "../components/ModalBase";
import { Notificacion } from "../components/Notificacion";

import { Pencil, Plus, UserPlus, Eye } from "lucide-react";
import FotoPorDefecto from "../assets/fotos_estudiante/CARD_PERFIL.jpg";

import { UserContext } from "../context/UserContext";
import {
  generarUsuarioEstudiante,
  generarUsuariosEstudiantesMasivo,
} from "../services/usuarioService";

export const EstudiantePage = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [fotos, setFotos] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 15;
  const { usuario } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [modalMasivo, setModalMasivo] = useState(false);
  const [modalIndividual, setModalIndividual] = useState({ visible: false, cedula: "" });
  const [noti, setNoti] = useState({ visible: false, texto: "", color: "" });

  useEffect(() => {
    if (!usuario) return;

    const esRutaSeguimientos = location.pathname === "/seguimientos";
    const esRutaEstudiantes = location.pathname === "/estudiantes";

    if (esRutaSeguimientos) {
      cargarEstudiantesConSeguimientos();
    } else if (esRutaEstudiantes) {
      if (usuario.rol === 2) {
        cargarEstudiantesConSeguimientos();
      } else {
        cargarEstudiantes();
      }
    }
  }, [location]);

  const cargarEstudiantes = async () => {
    try {
      const res = await obtenerTodosEstudiantes();
      setEstudiantes(res.data);
      precargarFotos(res.data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
    }
  };

  const cargarEstudiantesConSeguimientos = async () => {
    try {
      const res = await obtenerEstudiantesConSeguimientos();
      setEstudiantes(res.data);
      precargarFotos(res.data);
    } catch (error) {
      console.error("Error al cargar estudiantes con seguimiento:", error);
    }
  };

  const precargarFotos = (lista) => {
    lista.forEach(async (est) => {
      try {
        const resImg = await obtenerImagenEstudiante(est.id);
        const url = URL.createObjectURL(resImg.data);
        setFotos((prev) => ({ ...prev, [est.id]: url }));
      } catch {
        setFotos((prev) => ({ ...prev, [est.id]: FotoPorDefecto }));
      }
    });
  };

  const estudiantesFiltrados = estudiantes.filter((e) =>
    `${e.nombres} ${e.apellidos} ${e.nroDoc}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(estudiantesFiltrados.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const visibles = estudiantesFiltrados.slice(inicio, inicio + porPagina);

  const cambiarPagina = (nueva) => {
    if (nueva >= 1 && nueva <= totalPaginas) setPagina(nueva);
  };

  const datosTabla = visibles.map((e) => ({
    Foto: (
      <img
        src={fotos[e.id] || FotoPorDefecto}
        alt="Foto estudiante"
        className="w-10 h-10 object-cover rounded-full"
      />
    ),
    Nombre: `${e.nombres} ${e.apellidos}`,
    Documento: e.nroDoc,
    Correo: e.correo || "-",
    Acciones: (
      <div className="flex gap-2">
        <Button
          icon={Eye}
          title="Ver detalles"
          color="bg-blue-600"
          onClick={() => navigate(`/estudiantes/${e.id}`)}
        />
        {usuario.rol === 3 && (
          <>
            <Button
              icon={Pencil}
              title="Editar"
              color="bg-yellow-500"
              onClick={() => navigate(`/formulario-estudiante/${e.id}`)}
            />
            {!e.usuario && (
              <Button
                title="Generar usuario"
                icon={UserPlus}
                color="bg-green-700"
                onClick={() =>
                  setModalIndividual({ visible: true, cedula: e.nroDoc })
                }
              />
            )}
          </>
        )}
      </div>
    ),
  }));

  if (![0, 2, 3].includes(usuario.rol)) {
    return (
      <Layout>
        <main className="flex-1 p-4">
          <h2 className="text-xl font-semibold">Acceso restringido</h2>
          <p>No tiene permisos para acceder a esta sección.</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
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

        <Table
          columns={["Foto", "Nombre", "Documento", "Correo", "Acciones"]}
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

        <ModalBase visible={modalMasivo} onClose={() => setModalMasivo(false)}>
          <h3 className="text-xl font-semibold mb-4">
            ¿Generar usuarios para todos los estudiantes sin usuario?
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
                  await generarUsuariosEstudiantesMasivo();
                  setModalMasivo(false);
                  cargarEstudiantes();
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
                  await generarUsuarioEstudiante(modalIndividual.cedula);
                  setModalIndividual({ visible: false, cedula: "" });
                  cargarEstudiantes();
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
