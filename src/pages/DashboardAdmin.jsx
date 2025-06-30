import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "../layout/Layout";
import { Card } from "../components/Card";
import { Users, UserPlus, BarChart4 } from "lucide-react";

import { totalEstudiantes } from "../services/estudianteService";
import { totalDocentes } from "../services/docenteService";
import { totalCitas } from "../services/citaService";
import { obtenerEstadisticas } from "../services/estadisticaService";
import { totalPsicos } from "../services/psicoService";


export const DashboardAdmin = () => {
    const navigate = useNavigate();
    const [resumen, setResumen] = useState({
        estudiantes: 0,
        docentes: 0,
        citas: 0,
        seguimientos: 0,
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [est, doc, cit, stats, psicos] = await Promise.all([
                    totalEstudiantes(),
                    totalDocentes(),
                    totalCitas(),
                    obtenerEstadisticas(),
                    totalPsicos(),
                ]);

                setResumen({
                    estudiantes: est.data,
                    docentes: doc.data,
                    citas: cit.data,
                    seguimientos: stats.data.seguimientos || 0,
                    psicos: psicos.data,
                });

            } catch (error) {
                console.error("Error al cargar datos del dashboard admin:", error);
            }
        };

        cargarDatos();
    }, []);

    return (
        <Layout>
            <main className="flex-1 space-y-6">
                <h2 className="text-2xl font-bold">Panel del Administrador</h2>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4">
                        <Card
                            label="Estudiantes"
                            total={resumen.estudiantes}
                            icon={Users}
                            bgColor="bg-sky-500"
                            onClick={() => navigate("/estudiantes")}
                        />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        <Card
                            label="Docentes"
                            total={resumen.docentes}
                            icon={UserPlus}
                            bgColor="bg-indigo-500"
                            onClick={() => navigate("/docentes")}
                        />
                    </div>


                    <div className="col-span-12 md:col-span-4">
                        <Card
                            label="Psicorientadores"
                            total={resumen.psicos}
                            icon={UserPlus}
                            bgColor="bg-pink-500"
                            onClick={() => navigate("/psicos")}
                        />
                    </div>



                </div>
            </main>
        </Layout>
    );
};
