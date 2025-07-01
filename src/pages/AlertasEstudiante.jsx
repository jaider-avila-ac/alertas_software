  import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";
import { buscarConsultaPorEstudiante } from "../services/consultaService";
import { obtenerEstudiantePorId } from "../services/estudianteService";

import { Button } from "../components/Button";
import { Table } from "../components/Table";
import { Layout } from "../layout/Layout";

export const AlertasEstudiante = () => {
  const { usuario } = useContext(UserContext);
  const navigate = useNavigate();

  const [alertas, setAlertas] = useState([]);
  const [estudiante, setEstudiante] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resEst = await obtenerEstudiantePorId(usuario.id);
        setEstudiante(resEst.data);

        const resAlertas = await buscarConsultaPorEstudiante(usuario.id);
        const alertasFormateadas = resAlertas.data.map((a) => ({
  ID: a.id,
  Motivo: a.motivo,
  Fecha: new Date(a.fecha).toLocaleDateString(),
  Estado: a.estado || "Sin estado",
  Nivel: a.nivel || "Sin nivel", // <- corregido aquí
}));

        setAlertas(alertasFormateadas);
      } catch (error) {
        console.error("Error al cargar alertas del estudiante:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [usuario.id]);

  if (cargando) return <div className="p-4">Cargando...</div>;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">
          Mis Alertas (Consultas)
        </h1>

        {estudiante && (
          <div className="bg-white p-4 rounded shadow text-gray-700 space-y-1">
            <p><strong>Estudiante:</strong> {estudiante.nombres} {estudiante.apellidos}</p>
            <p><strong>Curso:</strong> {estudiante.curso}</p>
            <p><strong>Documento:</strong> {estudiante.nroDoc}</p>
          </div>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-2">Listado de Alertas</h2>
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
      </div>
    </Layout>
  );
};
