import { useEffect, useState } from "react";
import { obtenerTodosEstudiantes } from "../services/estudianteService";
import { Table } from "../components/Table";
import { Button } from "../components/Button";

import { useNavigate } from "react-router-dom";
import { Buscador } from "../components/Buscador";
import { Plus, Eye } from "lucide-react";
import { Layout } from "../layout/Layout";

export const EstudiantePage = () => {
  const [estudiantes, setEstudiantes] = useState([]);
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
      setEstudiantes(res.data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
    }
  };

  const estudiantesFiltrados = estudiantes.filter((e) =>
    `${e.id} ${e.nombres} ${e.apellidos} ${e.nroDoc}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
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
    src={`data:image/jpeg;base64,${e.imagen}`}
    alt="Foto"
    className="w-10 h-10 rounded-full object-cover"
  />
),
    Nombre: `${e.nombres} ${e.apellidos}`,
    Documento: e.nroDoc,
    Telefono: e.tel,
    Curso: e.curso || "-",
    Acciones: (
      <div className="flex gap-2">
        <Button
          icon={Eye}
          title="Mas detalles"
          color="bg-gray-500"
          onClick={() => navigate(`/estudiantes/${e.id}`)}
        />
        <Button
          title="Crear alerta"
          icon={Plus}
          color="bg-pink-500"
          onClick={() => navigate(`/consultas/nueva/${e.id}`)}
        />
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
            color="bg-indigo-600"
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
