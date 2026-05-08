import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerTodasConsultas } from "../../services/consultaService";
import { agendarCitaParaConsulta } from "../../services/citaService";
import { EstudianteAlertaCard } from "../EstudianteAlertaCard";
import { Button } from "../Button";
import { ModalAgendarCita } from "./ModalAgendarCita";
import { Esqueleto } from "../Esqueleto";
import { UserContext } from "../../context/UserContext";

let _cache = null;

const agrupar = (datos) => {
  const mapa = new Map();
  datos.forEach((c) => {
    if (!mapa.has(c.estudianteId)) {
      mapa.set(c.estudianteId, {
        estudianteId:     c.estudianteId,
        nombreEstudiante: c.nombreEstudiante,
        consultaId:       c.id,
        total:            0,
        pendientes:       0,
      });
    }
    const g = mapa.get(c.estudianteId);
    g.total += 1;
    const est = c.estado?.toLowerCase();
    if (!est || est === "pendiente" || est === "en_progreso") g.pendientes += 1;
  });
  return Array.from(mapa.values())
    .filter((g) => g.pendientes > 0)
    .sort((a, b) => b.pendientes - a.pendientes);
};

export const ListadoEstudiantesPendientes = () => {
  const [grupos,   setGrupos]   = useState(_cache ?? []);
  const [cargando, setCargando] = useState(!_cache);
  const [modalVisible, setModalVisible] = useState(false);
  const [consultaIdSeleccionada, setConsultaIdSeleccionada] = useState(null);

  const navigate = useNavigate();
  const { usuario } = useContext(UserContext);

  useEffect(() => {
    let active = true;

    obtenerTodasConsultas()
      .then((res) => {
        if (!active) return;
        const result = agrupar(res.data);
        _cache = result;
        setGrupos(result);
      })
      .catch((err) => console.error("Error al cargar consultas pendientes:", err))
      .finally(() => { if (active) setCargando(false); });

    return () => { active = false; };
  }, []);

  const confirmarAgendamiento = async (fecha) => {
    if (!usuario?.id) throw new Error("ID del psicorientador no disponible");
    return await agendarCitaParaConsulta(consultaIdSeleccionada, usuario.id, fecha);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Estudiantes con alertas pendientes</h3>

      {cargando ? (
        Array(3).fill(0).map((_, i) => (
          <Esqueleto key={i} className="h-16 w-full rounded" />
        ))
      ) : grupos.length === 0 ? (
        <p className="text-gray-500 italic text-sm">
          No hay estudiantes pendientes por cita.
        </p>
      ) : (
        grupos.map((g) => (
          <EstudianteAlertaCard
            key={g.estudianteId}
            grupo={g}
            onClick={() =>
              navigate(`/consultas/estudiante/${g.estudianteId}`, {
                state: { from: "dashboard" },
              })
            }
            actions={
              usuario?.rol === 2 ? (
                <Button
                  text="Agendar cita"
                  color="bg-pink-500"
                  onClick={() => {
                    setConsultaIdSeleccionada(g.consultaId);
                    setModalVisible(true);
                  }}
                />
              ) : null
            }
          />
        ))
      )}

      <ModalAgendarCita
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={confirmarAgendamiento}
      />
    </div>
  );
};
