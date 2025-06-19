import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerEstudiantePorId } from "../services/estudianteService";
import { obtenerAntecedentesPorEstudiante } from "../services/antecedenteService";
import { obtenerFamiliaresPorEstudiante } from "../services/familiarService";
import { buscarConsultaPorEstudiante } from "../services/consultaService";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Button } from "../components/Button";
import { Table } from "../components/Table";
import { DatoCampo } from "../components/DatoCampo";
import { Plus } from "lucide-react";

export const EstudianteDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [estudiante, setEstudiante] = useState(null);
    const [antecedentes, setAntecedentes] = useState(null);
    const [familiares, setFamiliares] = useState([]);
    const [alertas, setAlertas] = useState([]);

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
                setAntecedentes(resAnt.data);
            } catch {
                setAntecedentes(null);
            }

            try {
                const resFam = await obtenerFamiliaresPorEstudiante(id);
                setFamiliares(resFam.data);
            } catch {
                setFamiliares([]);
            }

            try {
                const resAlertas = await buscarConsultaPorEstudiante(id);
                const datos = resAlertas.data.map((a) => ({
                    ID: a.id,
                    Motivo: a.motivo,
                    Fecha: new Date(a.fecha).toLocaleDateString(),
                    Estado: a.estado,
                    Nivel: a.alerta,
                }));
                setAlertas(datos);
            } catch {
                setAlertas([]);
            }
        };

        fetchDatos();
    }, [id]);

    if (estudiante === undefined) {
        return (
            <div className="p-4 text-red-600 font-semibold text-center">
                No se encontró información del estudiante.
            </div>
        );
    }

    if (!estudiante) return <div className="p-4">Cargando...</div>;

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header nombre="Docente Demo" rol="Docente" />
                <main className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">
                            Detalles de {estudiante.nombres} {estudiante.apellidos}
                        </h2>
                        <Button
                            text="Agregar alerta"
                            icon={Plus}
                            color="bg-blue-600"
                            onClick={() => navigate(`/crear-alerta?estudianteId=${id}`)}
                        />
                    </div>

                    {/* Información del estudiante */}
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

                    {/* Antecedentes */}
                    <section>
                        <h3 className="text-xl font-semibold mb-2">Antecedentes</h3>
                        {antecedentes ? (
                            <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow">
                                <DatoCampo label="Salud" value={antecedentes.salud} />
                                <DatoCampo label="Fortalecimiento" value={antecedentes.fortalecimiento} />
                                <DatoCampo label="Reprobados" value={antecedentes.reprobados} />
                                <DatoCampo label="Personales" value={antecedentes.personales} />
                                <DatoCampo label="Filiares" value={antecedentes.filiares || ""} />
                                <DatoCampo label="Educación" value={antecedentes.educacion} />
                                <DatoCampo label="Socioafectivo" value={antecedentes.socioafectivo || ""} />
                                <DatoCampo label="Disciplina" value={antecedentes.disciplina} />
                            </div>
                        ) : (
                            <p className="italic text-gray-600">Sin antecedentes registrados.</p>
                        )}
                    </section>


                    <section>
                        <h3 className="text-xl font-semibold mb-2">Familiares</h3>
                        {familiares.length > 0 ? (
                            <div className="grid gap-4">
                                {familiares.map((fami, i) => (
                                    <div key={i} className="grid grid-cols-3 gap-4 bg-white p-4 rounded shadow">
                                        <DatoCampo label="Nombre" value={`${fami.nombres} ${fami.apellidos}`} />
                                        <DatoCampo label="Parentesco" value={fami.parentesco} />
                                        <DatoCampo label="Fecha Nac" value={fami.fechaNacimiento} />
                                        <DatoCampo label="Escolaridad" value={fami.escolaridad} />
                                        <DatoCampo label="Teléfono" value={fami.telefono} />
                                        <DatoCampo label="Horario" value={fami.horario} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="italic text-gray-600">Sin familiares registrados.</p>
                        )}
                    </section>


                    <section>
                        <h3 className="text-xl font-semibold mb-2">Alertas</h3>
                        {alertas.length > 0 ? (
                            <Table columns={["ID", "Motivo", "Fecha", "Estado", "Nivel"]} data={alertas} />
                        ) : (
                            <p className="italic text-gray-600">No presenta alertas.</p>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};
