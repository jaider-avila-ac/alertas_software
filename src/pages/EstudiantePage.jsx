import { useEffect, useState } from "react";
import {
  obtenerTodosEstudiantes,
  obtenerImagenEstudiante,
} from "../services/estudianteService";

import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { Buscador } from "../components/Buscador";
import { Layout } from "../layout/Layout";

import { useNavigate } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import FotoPorDefecto from "../assets/fotos_estudiante/CARD_PERFIL.jpg";

import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const EstudiantePage = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [fotos, setFotos] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 15;
  const navigate = useNavigate();

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      const res = await obtenerTodosEstudiantes();
      const lista = res.data;
      setEstudiantes(lista);

      // Pre-cargar imagenes por estudiante
      lista.forEach(async (est) => {
        try {
          const resImg = await obtenerImagenEstudiante(est.id);
          const url = URL.createObjectURL(resImg.data);
          setFotos((prev) => ({ ...prev, [est.id]: url }));
        } catch {
          setFotos((prev) => ({ ...prev, [est.id]: FotoPorDefecto }));
        }
      });
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
    }
  };

  const estudiantesFiltrados = estudiantes.filter((e) =>
    `${e.nombres} ${e.apellidos} ${e.nroDoc}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(estudiantesFiltrados.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const visibles = estudiantesFiltrados.slice(inicio, inicio + porPagina);
  const { usuario } = useContext(UserContext);

  const cambiarPagina = (nueva) => {
    if (nueva >= 1 && nueva <= totalPaginas) setPagina(nueva);
  };

  const datosTabla = visibles.map((e) => ({
    Foto: (
      <img
        src={fotos[e.id] || FotoPorDefecto}
        alt="Foto"
        className="w-10 h-10 rounded-full object-cover"
      />
    ),
    Nombre: `${e.nombres} ${e.apellidos}`,
    Documento: e.nroDoc,
    Curso: e.curso || "-",
    Telefono: e.tel,
    Acciones: (
      <div className="flex gap-2">
        <Button
          icon={Eye}
          title="Más detalles"
          color="bg-gray-500"
          onClick={() => navigate(`/estudiantes/${e.id}`)}
        />
        {usuario.rol === 0 && (
          <Button
            title="Crear alerta"
            icon={Plus}
            color="bg-pink-500"
            onClick={() => navigate(`/consultas/nueva/${e.id}`)}
          />
        )}
      </div>
    ),
  }));

  return (
    <Layout>
      <main className="flex-1 overflow-y-auto space-y-4">
        <h2 className="text-2xl font-bold">Estudiantes</h2>

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
          columns={["Foto", "Nombre", "Documento", "Curso", "Telefono", "Acciones"]}
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
      </main>
    </Layout>
  );
};
