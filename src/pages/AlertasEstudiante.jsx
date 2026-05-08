import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";
import { buscarConsultaPorEstudiante } from "../services/consultaService";
import { obtenerEstudiantePorId } from "../services/estudianteService";

import DataTable from "../components/ui/DataTable";
import { Button } from "../components/Button";

const COLUMNS = [
  { key: "id",     label: "ID",     sortable: true },
  { key: "motivo", label: "Motivo", sortable: true },
  { key: "fecha",  label: "Fecha",  sortable: true },
  { key: "estado", label: "Estado", sortable: true },
  { key: "nivel",  label: "Nivel",  sortable: true },
];

export const AlertasEstudiante = () => {
  const { usuario } = useContext(UserContext);
  const navigate    = useNavigate();

  const [alertas,     setAlertas]     = useState([]);
  const [estudiante,  setEstudiante]  = useState(null);
  const [cargando,    setCargando]    = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resEst = await obtenerEstudiantePorId(usuario.id);
        setEstudiante(resEst.data);

        const resAlertas = await buscarConsultaPorEstudiante(usuario.id);
        setAlertas(
          (resAlertas.data || []).map((a) => ({
            id:     a.id,
            motivo: a.motivo,
            fecha:  a.fecha ? new Date(a.fecha).toLocaleDateString() : "Sin fecha",
            estado: a.estado || "Sin estado",
            nivel:  a.nivel  || "Sin nivel",
          }))
        );
      } catch (error) {
        console.error("Error al cargar alertas del estudiante:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [usuario.id]);

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Mis Alertas</h1>

      {estudiante && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-gray-700 space-y-1 text-sm">
          <p><strong>Estudiante:</strong> {estudiante.nombres} {estudiante.apellidos}</p>
          <p><strong>Curso:</strong> {estudiante.curso}</p>
          <p><strong>Documento:</strong> {estudiante.nroDoc}</p>
        </div>
      )}

      <DataTable
        columns={COLUMNS}
        rows={alertas}
        loading={cargando}
        searchKeys={["motivo", "estado"]}
        actions={(row) => (
          <Button
            text="Ver seguimientos"
            color="bg-green-600"
            onClick={() =>
              navigate(
                `/seguimientos/${row.id}?estudiante=${estudiante?.nombres ?? ""} ${estudiante?.apellidos ?? ""}`
              )
            }
          />
        )}
        empty="No presenta alertas."
      />
    </main>
  );
};
