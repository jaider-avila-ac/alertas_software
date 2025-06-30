import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerTodosEstudiantes } from "../services/estudianteService";
import { Layout } from "../layout/Layout";
import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { Plus, QrCode, Pencil } from "lucide-react";
import { Notificacion } from "../components/Notificacion";

export const EstudiantesAdmin = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [notificacion, setNotificacion] = useState(null);
  const navigate = useNavigate();

  const columnas = ["ID", "Nombres", "Apellidos", "Documento", "Acciones"];

  const cargarEstudiantes = async () => {
    try {
      const res = await obtenerTodosEstudiantes();
      setEstudiantes(res.data);
    } catch (err) {
      console.error("Error al cargar estudiantes:", err);
    }
  };

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Gestión de Estudiantes</h1>

        {notificacion && (
          <Notificacion texto={notificacion.texto} color={notificacion.color} />
        )}

        <div className="flex justify-between items-center">
          <Button
            text="Agregar Estudiante"
            icon={Plus}
            color="bg-blue-600"
            onClick={() => navigate("/estudiantes_admin/nuevo")}
          />
        </div>

        <Table
          columns={columnas}
          data={estudiantes.map((e) => ({
            ID: e.id,
            Nombres: e.nombres,
            Apellidos: e.apellidos,
            Documento: e.nroDoc,
            Acciones: (
              <div className="flex gap-2">
                <button
                  title="Editar"
                  onClick={() => navigate(`/estudiantes_admin/${e.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={16} />
                </button>
                <button
                  title="Generar QR"
                  onClick={() => alert("Generar QR no implementado")}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <QrCode size={16} />
                </button>
              </div>
            ),
          }))}
          showActions={false}
        />
      </div>
    </Layout>
  );
};
