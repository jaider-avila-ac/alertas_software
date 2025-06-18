import { useEffect, useState } from "react";
import { obtenerTodosEstudiantes } from "../services/estudianteService";
import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

export const EstudiantePage = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 15;

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

  const columnas = ["id","Nombre", "Documento", "Curso", "Acciones"];

const datos = visibles.map((e) => ({
    ID: `${e.id}`,
  Nombre: `${e.nombres} ${e.apellidos}`,
  Documento: e.nroDoc,
  Curso: e.curso || "-",
  Acciones: (
    <div className="flex gap-2">
      <Button text="Ver" color="bg-gray-500" onClick={() => {}} />
          <Button text="Alerta" color="bg-gray-500" onClick={() => {}} />
    </div>
  ),
}));

console.log("📊 Datos mostrados en tabla:", visibles.map(e => ({
  nombres: e.nombres,
  apellidos: e.apellidos,
  nroDoc: e.nroDoc,
  curso: e.curso
})));

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header nombre="Docente" rol="Docente" />
        <main className="p-4 space-y-4">
          <h2 className="text-2xl font-bold">Estudiantes</h2>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre o documento"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border rounded px-3 py-2 w-full max-w-md"
            />
            <Button text="Buscar" color="bg-indigo-600" onClick={() => setPagina(1)} />
          </div>

          <Table columns={columnas} data={datos} />

          <div className="flex justify-between items-center mt-4">
            <Button text="Anterior" color="bg-gray-400" onClick={() => cambiarPagina(pagina - 1)} />
            <span>Página {pagina} de {totalPaginas}</span>
            <Button text="Siguiente" color="bg-gray-400" onClick={() => cambiarPagina(pagina + 1)} />
          </div>
        </main>
      </div>
    </div>
  );
};
