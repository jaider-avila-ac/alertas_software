import { useEffect, useState, useContext } from "react";
import { obtenerTodasConsultas } from "../../services/consultaService";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { alertaVisual } from "../../utils/alertaVisual";
import FotoPorDefecto from "../../assets/fotos_estudiante/CARD_PERFIL.jpg";
import { obtenerImagenEstudiante } from "../../services/estudianteService";
import { agendarCitaParaConsulta } from "../../services/citaService";
import { Button } from "../Button";
import { ModalAgendarCita } from "./ModalAgendarCita";

export const ListadoEstudiantesPendientes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [fotos, setFotos] = useState({});
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [consultaIdSeleccionada, setConsultaIdSeleccionada] = useState(null);

  const navigate = useNavigate();
  const { usuario } = useContext(UserContext);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await obtenerTodasConsultas();
        const pendientes = res.data.filter(
          (c) =>
            !c.estado ||
            c.estado.toLowerCase() === "pendiente" ||
            c.estado.toLowerCase() === "en_progreso"
        );

        const agrupados = new Map();

        pendientes.forEach((c) => {
          if (!agrupados.has(c.estudianteId)) {
            const nivel = c.nivel?.toLowerCase();
            const visual = alertaVisual[nivel] || alertaVisual.desconocido;

            agrupados.set(c.estudianteId, {
              consultaId: c.id,
              estudianteId: c.estudianteId,
              nombreEstudiante: c.nombreEstudiante,
              curso: c.curso || "",
              imagen: c.imagen,
              icono: visual.icono,
              color: visual.color,
            });
          }
        });

        const listaEstudiantes = Array.from(agrupados.values());
        setEstudiantes(listaEstudiantes);

        listaEstudiantes.forEach(async (e) => {
          try {
            if (e.imagen) {
              const resImg = await obtenerImagenEstudiante(e.estudianteId);
              const url = URL.createObjectURL(resImg.data);
              setFotos((prev) => ({ ...prev, [e.estudianteId]: url }));
            } else {
              setFotos((prev) => ({ ...prev, [e.estudianteId]: FotoPorDefecto }));
            }
          } catch {
            setFotos((prev) => ({ ...prev, [e.estudianteId]: FotoPorDefecto }));
          }
        });
      } catch (error) {
        console.error("Error al cargar consultas pendientes:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const abrirModalAgendar = (consultaId) => {
    setConsultaIdSeleccionada(consultaId);
    setModalVisible(true);
  };

 
  const confirmarAgendamiento = async (fecha) => {
    if (!usuario?.id) throw new Error("ID del psicorientador no disponible");
    return await agendarCitaParaConsulta(consultaIdSeleccionada, usuario.id, fecha);
  };

  const verAlertas = (estudianteId) => {
    navigate(`/consultas?estudianteId=${estudianteId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Estudiantes con alertas pendientes</h2>

      {cargando ? (
        <p className="text-gray-500">Cargando...</p>
      ) : estudiantes.length === 0 ? (
        <p className="text-gray-600 italic">No hay estudiantes pendientes por cita.</p>
      ) : (
        <ul className="space-y-3">
          {estudiantes.map((est) => (
            <li
              key={est.estudianteId}
              className="bg-white rounded shadow p-3 flex items-center gap-4 cursor-pointer hover:shadow-md transition"
              onClick={() => verAlertas(est.estudianteId)}
            >
              <img
                src={fotos[est.estudianteId] || FotoPorDefecto}
                alt="Foto"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-bold text-sm mb-1">{est.nombreEstudiante}</p>
                <p className="text-xs text-gray-600">Curso: {est.curso || "-"}</p>
              </div>
              {usuario?.rol === 2 && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Button
                    text="Agendar cita"
                    color="bg-pink-600"
                    onClick={() => abrirModalAgendar(est.consultaId)}
                    title="Agendar nueva cita para sus alertas"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <ModalAgendarCita
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={confirmarAgendamiento}
      />
    </div>
  );
};
