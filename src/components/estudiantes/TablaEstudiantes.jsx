import { Button } from "../Button";
import { Table } from "../Table";
import FotoPorDefecto from "../../assets/fotos_estudiante/CARD_PERFIL.jpg";
import { Eye, Pencil, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext, useMemo } from "react";
import { UserContext } from "../../context/UserContext";
import { GeneradorQR } from "./GeneradorQR";

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

  // ✅ Estabilizar datos con useMemo
  const { datosTabla, totalPaginas, paginaActual } = useMemo(() => {
    if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
      return { datosTabla: [], totalPaginas: 1, paginaActual: 1 };
    }

    const inicio = (pagina - 1) * porPagina;
    const visibles = estudiantes.slice(inicio, inicio + porPagina);
    const total = Math.max(1, Math.ceil(estudiantes.length / porPagina));

    const datos = visibles.map((e) => {
      // ✅ Agregar una key única basada en el ID del estudiante
      const uniqueKey = `estudiante-${e.id}-${e.nroDoc}`;
      
      return {
        _key: uniqueKey, // Key interna para React
        Foto: (
          <img
            key={`foto-${e.id}`}
            src={fotos[e.id] || FotoPorDefecto}
            alt="Foto estudiante"
            className="w-10 h-10 object-cover rounded-full"
          />
        ),
        Nombre: `${e.nombres} ${e.apellidos}`,
        Documento: e.nroDoc,
        Correo: e.correo || "-",
        Acciones: (
          <div key={`acciones-${e.id}`} className="flex gap-2">
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
                <GeneradorQR estudiante={e} />
              </>
            )}
          </div>
        ),
      };
    });

    return { datosTabla: datos, totalPaginas: total, paginaActual: pagina };
  }, [estudiantes, fotos, pagina, porPagina, usuario.rol, navigate, setModalIndividual]);

  const cambiarPagina = (nueva) => {
    if (nueva >= 1 && nueva <= totalPaginas) {
      setPagina(nueva);
    }
  };

  // ✅ Si no hay datos, mostrar mensaje
  if (datosTabla.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay estudiantes para mostrar
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table
        columns={["Foto", "Nombre", "Documento", "Correo", "Acciones"]}
        data={datosTabla}
      />

      {totalPaginas > 1 && (
        <div className="flex justify-between items-center">
          <Button
            text="Anterior"
            color="bg-gray-400"
            onClick={() => cambiarPagina(paginaActual - 1)}
          />
          <span className="text-gray-700 font-medium">
            Página {paginaActual} de {totalPaginas}
          </span>
          <Button
            text="Siguiente"
            color="bg-gray-400"
            onClick={() => cambiarPagina(paginaActual + 1)}
          />
        </div>
      )}
    </div>
  );
};