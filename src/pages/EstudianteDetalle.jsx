import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerEstudiantePorId } from "../services/estudianteService";
import { obtenerAntecedentesPorEstudiante } from "../services/antecedenteService";
import { obtenerFamiliaresPorEstudiante } from "../services/familiarService";
import { buscarConsultaPorEstudiante } from "../services/consultaService";
import {
  obtenerSeguimientosPorConsulta,
  generarResumenIA,
  guardarResumenGeneral,
} from "../services/seguimientoService";

import { UserContext } from "../context/UserContext";
import DataTable from "../components/ui/DataTable";
import { Button } from "../components/Button";
import { DatoCampo } from "../components/DatoCampo";
import { Plus, ArrowLeft } from "lucide-react";
import { ResumenGeneral } from "../components/psico/ResumenGeneral";

const COLS_ANTECEDENTES = [
  { key: "categoria", label: "Categoría" },
  { key: "detalle",   label: "Detalle"   },
  { key: "fecha",     label: "Fecha"     },
];

const COLS_FAMILIARES = [
  { key: "nombre",     label: "Nombre"      },
  { key: "parentesco", label: "Parentesco"  },
  { key: "fechaNac",   label: "Fecha Nac."  },
  { key: "escolaridad",label: "Escolaridad" },
  { key: "telefono",   label: "Teléfono"    },
  { key: "horario",    label: "Horario"     },
];

const COLS_ALERTAS = [
  { key: "id",     label: "ID",     sortable: true },
  { key: "motivo", label: "Motivo", sortable: true },
  { key: "fecha",  label: "Fecha",  sortable: true },
  { key: "estado", label: "Estado", sortable: true },
  { key: "nivel",  label: "Nivel",  sortable: true },
];

export const EstudianteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(UserContext);

  const [estudiante,           setEstudiante]           = useState(null);
  const [antecedentes,         setAntecedentes]         = useState([]);
  const [familiares,           setFamiliares]           = useState([]);
  const [alertas,              setAlertas]              = useState([]);
  const [resumenGeneral,       setResumenGeneral]       = useState("");
  const [idSeguimientoGeneral, setIdSeguimientoGeneral] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resEst = await obtenerEstudiantePorId(id);
        setEstudiante(resEst.data);
      } catch (error) {
        console.error("Error al cargar estudiante:", error);
        setEstudiante(undefined);
        return;
      }

      try {
        const resAnt = await obtenerAntecedentesPorEstudiante(id);
        setAntecedentes(
          (resAnt.data || []).map((a) => ({
            id:        a.id,
            categoria: a.categoria?.nombre || "N/A",
            detalle:   a.detalle,
            fecha:     new Date(a.fechaRegistro).toLocaleDateString(),
          }))
        );
      } catch { setAntecedentes([]); }

      try {
        const resFam = await obtenerFamiliaresPorEstudiante(id);
        setFamiliares(
          (resFam.data || []).map((f) => ({
            id:          f.id,
            nombre:      `${f.nombres} ${f.apellidos}`,
            parentesco:  f.parentesco,
            fechaNac:    f.fechaNacimiento,
            escolaridad: f.escolaridad,
            telefono:    f.telefono,
            horario:     f.horario,
          }))
        );
      } catch { setFamiliares([]); }

      try {
        const resAlertas = await buscarConsultaPorEstudiante(id);
        const consultas = resAlertas.data || [];
        setAlertas(
          consultas.map((a) => ({
            id:     a.id,
            motivo: a.motivo,
            fecha:  new Date(a.fecha).toLocaleDateString(),
            estado: a.estado,
            nivel:  a.alerta,
          }))
        );

        for (const alerta of consultas) {
          try {
            const resSeg = await obtenerSeguimientosPorConsulta(alerta.id);
            if (resSeg.data?.id) {
              setIdSeguimientoGeneral(resSeg.data.id);
              setResumenGeneral(resSeg.data.resumenGeneral || "");
              break;
            }
          } catch { /* continuar con la siguiente */ }
        }
      } catch { setAlertas([]); }
    };

    fetchDatos();
  }, [id]);

  const generarResumen = async () => {
    if (!idSeguimientoGeneral) return "NO_OBSERVACIONES";
    try {
      const res = await generarResumenIA(idSeguimientoGeneral);
      return res.data;
    } catch { return "ERROR"; }
  };

  const guardarResumen = async () => {
    if (!idSeguimientoGeneral) return;
    await guardarResumenGeneral(idSeguimientoGeneral, resumenGeneral);
  };

  if (estudiante === undefined) {
    return (
      <div className="p-4 text-red-600 font-semibold text-center">
        No se encontró información del estudiante.
      </div>
    );
  }

  if (!estudiante) return <div className="p-4">Cargando...</div>;

  return (
    <main className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold">
          Detalles de {estudiante.nombres} {estudiante.apellidos}
        </h2>
        <div className="flex gap-2">
          {(usuario.rol === 0 || usuario.rol === 2) && (
            <Button
              text="Agregar alerta"
              icon={Plus}
              color="bg-pink-500"
              onClick={() => navigate(`/consultas/nueva/${id}`)}
            />
          )}
          <Button
            text="Volver"
            icon={ArrowLeft}
            color="bg-gray-500"
            onClick={() => navigate("/estudiantes")}
          />
        </div>
      </div>

      <section>
        <h3 className="text-xl font-semibold mb-2">Información del estudiante</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <DatoCampo label="Tipo Doc"  value={estudiante.tipoDoc}    />
          <DatoCampo label="Nro Doc"   value={estudiante.nroDoc}     />
          <DatoCampo label="Fecha Nac" value={estudiante.fechaNac}   />
          <DatoCampo label="Género"    value={estudiante.genero}     />
          <DatoCampo label="Teléfono"  value={estudiante.tel || ""}  />
          <DatoCampo label="Curso"     value={estudiante.curso}      />
          <DatoCampo label="Dirección" value={estudiante.direccion}  />
          <DatoCampo label="Barrio"    value={estudiante.barrio}     />
          <DatoCampo label="Acudiente" value={estudiante.acudiente}  />
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Antecedentes</h3>
        {antecedentes.length > 0 ? (
          <DataTable columns={COLS_ANTECEDENTES} rows={antecedentes} empty="Sin antecedentes." />
        ) : (
          <p className="italic text-gray-600">Sin antecedentes registrados.</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Familiares</h3>
        {familiares.length > 0 ? (
          <DataTable columns={COLS_FAMILIARES} rows={familiares} empty="Sin familiares." />
        ) : (
          <p className="italic text-gray-600">Sin familiares registrados.</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Alertas</h3>
        {alertas.length > 0 ? (
          <DataTable
            columns={COLS_ALERTAS}
            rows={alertas}
            searchKeys={["motivo", "estado"]}
            actions={(row) => (
              <Button
                text="Ver"
                color="bg-green-600"
                onClick={() =>
                  navigate(
                    `/seguimientos/${row.id}?estudiante=${estudiante.nombres} ${estudiante.apellidos}`
                  )
                }
              />
            )}
            empty="No presenta alertas."
          />
        ) : (
          <p className="italic text-gray-600">No presenta alertas.</p>
        )}
      </section>

      {idSeguimientoGeneral && (
        <section>
          <h3 className="text-xl font-semibold mb-2">Resumen General</h3>
          <ResumenGeneral
            resumen={resumenGeneral}
            setResumen={setResumenGeneral}
            onGenerar={generarResumen}
            onGuardar={guardarResumen}
          />
        </section>
      )}
    </main>
  );
};
