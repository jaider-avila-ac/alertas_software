import { Button } from "../Button";
import { Table } from "../Table";
import FotoPorDefecto from "../../assets/fotos_estudiante/CARD_PERFIL.jpg";
import { Eye, Pencil, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

export const TablaEstudiantes = ({
  estudiantes,
  fotos,
  pagina,
  porPagina,
  setPagina,
  setModalIndividual,
}) => {
  const { usuario } = useContext(UserContext);
  const navigate = useNavigate();

  const inicio = (pagina - 1) * porPagina;
  const visibles = estudiantes.slice(inicio, inicio + porPagina);

  const totalPaginas = Math.max(1, Math.ceil(estudiantes.length / porPagina));

  const cambiarPagina = (nueva) => {
    if (nueva >= 1 && nueva <= totalPaginas) {
      setPagina(nueva);
    }
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

  return (
    <>
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
    </>
  );
};
