import { useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import DataTable from "../ui/DataTable";
import { Button } from "../Button";
import { GeneradorQR } from "./GeneradorQR";
import FotoPorDefecto from "../../assets/fotos_estudiante/CARD_PERFIL.jpg";
import { Eye, Pencil, UserPlus } from "lucide-react";

const COLUMNS = [
  {
    key:         "fotoUrl",
    label:       "",
    sortable:    false,
    hideOnMobile: true,
    render:      (url) => (
      <img
        src={url || FotoPorDefecto}
        alt="Foto"
        className="w-10 h-10 object-cover rounded-lg"
      />
    ),
  },
  { key: "nombre",  label: "Nombre",    sortable: true  },
  { key: "nroDoc",  label: "Documento", sortable: true  },
  { key: "correo",  label: "Correo",    sortable: false },
];

export const TablaEstudiantes = ({ estudiantes, fotos, setModalIndividual, loading = false }) => {
  const { usuario } = useContext(UserContext);
  const navigate    = useNavigate();

  const rows = useMemo(
    () =>
      (estudiantes || []).map((e) => ({
        ...e,
        nombre:  `${e.nombres} ${e.apellidos}`,
        correo:  e.correo || "—",
        fotoUrl: fotos?.[e.id] || FotoPorDefecto,
      })),
    [estudiantes, fotos]
  );

  return (
    <DataTable
      columns={COLUMNS}
      rows={rows}
      searchKeys={["nombre", "nroDoc"]}
      loading={loading}
      empty="No hay estudiantes para mostrar."
      actions={(row) => (
        <div className="flex gap-2">
          <Button
            icon={Eye}
            title="Ver detalles"
            color="bg-blue-600"
            onClick={() => navigate(`/estudiantes/${row.id}`)}
          />
          {usuario.rol === 3 && (
            <>
              <Button
                icon={Pencil}
                title="Editar"
                color="bg-yellow-500"
                onClick={() => navigate(`/formulario-estudiante/${row.id}`)}
              />
              {!row.usuario && (
                <Button
                  icon={UserPlus}
                  title="Generar usuario"
                  color="bg-green-700"
                  onClick={() => setModalIndividual({ visible: true, cedula: row.nroDoc })}
                />
              )}
              <GeneradorQR estudiante={row} />
            </>
          )}
        </div>
      )}
    />
  );
};
