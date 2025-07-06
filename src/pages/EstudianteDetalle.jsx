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
import { Button } from "../components/Button";
import { Table } from "../components/Table";
import { DatoCampo } from "../components/DatoCampo";
import { Plus } from "lucide-react";
import { ResumenGeneral } from "../components/psico/ResumenGeneral";

export const EstudianteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(UserContext);

  const [estudiante, setEstudiante] = useState(null);
  const [antecedentes, setAntecedentes] = useState([]);
  const [familiares, setFamiliares] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [resumenGeneral, setResumenGeneral] = useState("");
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
        setAntecedentes(resAnt.data || []);
      } catch {
        setAntecedentes([]);
      }

      try {
        const resFam = await obtenerFamiliaresPorEstudiante(id);
        setFamiliares(resFam.data || []);
      } catch {
        setFamiliares([]);
      }

      try {
        const resAlertas = await buscarConsultaPorEstudiante(id);
        const consultas = resAlertas.data || [];
        const datos = consultas.map((a) => ({
          ID: a.id,
          Motivo: a.motivo,
          Fecha: new Date(a.fecha).toLocaleDateString(),
          Estado: a.estado,
          Nivel: a.alerta,
        }));
        setAlertas(datos);

        for (const alerta of consultas) {
          try {
            const resSeg = await obtenerSeguimientosPorConsulta(alerta.id);
            if (resSeg.data?.id) {
              setIdSeguimientoGeneral(resSeg.data.id);
              setResumenGeneral(resSeg.data.resumenGeneral || "");
              break;
            }
          } catch {
            // continuar con la siguiente
          }
        }
      } catch {
        setAlertas([]);
      }
    };

    fetchDatos();
  }, [id]);

  const generarResumen = async () => {
    if (!idSeguimientoGeneral) return "NO_OBSERVACIONES";
    try {
      const res = await generarResumenIA(idSeguimientoGeneral);
      return res.data;
    } catch {
      return "ERROR";
    }
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
    <main className="flex-1 overflow-y-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Detalles de {estudiante.nombres} {estudiante.apellidos}
        </h2>
        {usuario.rol === 0 && (
          <Button
            text="Agregar alerta"
            icon={Plus}
            color="bg-blue-600"
            onClick={() => navigate(`/consultas/nueva/${id}`)}
          />
        )}
      </div>

      <section>
        <h3 className="text-xl font-semibold mb-2">Información del estudiante</h3>
        <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded shadow">
          <DatoCampo label="Tipo Doc" value={estudiante.tipoDoc} />
          <DatoCampo label="Nro Doc" value={estudiante.nroDoc} />
          <DatoCampo label="Fecha Nac" value={estudiante.fechaNac} />
          <DatoCampo label="Género" value={estudiante.genero} />
          <DatoCampo label="Teléfono" value={estudiante.tel || ""} />
          <DatoCampo label="Curso" value={estudiante.curso} />
          <DatoCampo label="Dirección" value={estudiante.direccion} />
          <DatoCampo label="Barrio" value={estudiante.barrio} />
          <DatoCampo label="Acudiente" value={estudiante.acudiente} />
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Antecedentes</h3>
        {antecedentes.length > 0 ? (
          <Table
            columns={["Categoría", "Detalle", "Fecha"]}
            data={antecedentes.map((a) => ({
              Categoría: a.categoria?.nombre || "N/A",
              Detalle: a.detalle,
              Fecha: new Date(a.fechaRegistro).toLocaleDateString(),
            }))}
          />
        ) : (
          <p className="italic text-gray-600">Sin antecedentes registrados.</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Familiares</h3>
        {familiares.length > 0 ? (
          <Table
            columns={["Nombre", "Parentesco", "Fecha Nac.", "Escolaridad", "Teléfono", "Horario"]}
            data={familiares.map((f) => ({
              Nombre: `${f.nombres} ${f.apellidos}`,
              Parentesco: f.parentesco,
              "Fecha Nac.": f.fechaNacimiento,
              Escolaridad: f.escolaridad,
              Teléfono: f.telefono,
              Horario: f.horario,
            }))}
          />
        ) : (
          <p className="italic text-gray-600">Sin familiares registrados.</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Alertas</h3>
        {alertas.length > 0 ? (
          <Table
            columns={["ID", "Motivo", "Fecha", "Estado", "Nivel", "Ver Seguimientos"]}
            data={alertas.map((a) => ({
              ...a,
              "Ver Seguimientos": (
                <Button
                  text="Ver"
                  color="bg-green-600"
                  onClick={() =>
                    navigate(`/seguimientos/${a.ID}?estudiante=${estudiante.nombres} ${estudiante.apellidos}`)
                  }
                />
              ),
            }))}
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
