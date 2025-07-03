import { useEffect, useState } from "react";
import {
  obtenerTodosEstudiantes,
  obtenerImagenEstudiante,
} from "../../services/estudianteService";
import { obtenerEstudiantesConSeguimientos } from "../../services/seguimientoService";

export const useEstudiantes = ({ soloConSeguimiento }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [fotos, setFotos] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (soloConSeguimiento) {
      cargarEstudiantesConSeguimiento();
    } else {
      cargarTodosEstudiantes();
    }
  }, [soloConSeguimiento]);

  const cargarTodosEstudiantes = async () => {
    try {
      setCargando(true);
      const res = await obtenerTodosEstudiantes();
      setEstudiantes(res.data);
      precargarFotos(res.data);
    } catch (err) {
      console.error("Error al cargar estudiantes:", err);
    } finally {
      setCargando(false);
    }
  };

  const cargarEstudiantesConSeguimiento = async () => {
    try {
      setCargando(true);
      const res = await obtenerEstudiantesConSeguimientos();
      setEstudiantes(res.data);
      precargarFotos(res.data);
    } catch (err) {
      console.error("Error al cargar estudiantes con seguimiento:", err);
    } finally {
      setCargando(false);
    }
  };

  const precargarFotos = (lista) => {
    lista.forEach(async (est) => {
      if (est.imagen === null) return;

      try {
        const resImg = await obtenerImagenEstudiante(est.id);
        const url = URL.createObjectURL(resImg.data);
        setFotos((prev) => ({ ...prev, [est.id]: url }));
      } catch {
        // No guardar nada si falla
      }
    });
  };

  return {
    estudiantes,
    fotos,
    cargando,
    recargar: soloConSeguimiento
      ? cargarEstudiantesConSeguimiento
      : cargarTodosEstudiantes,
  };
};
