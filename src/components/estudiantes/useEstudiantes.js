import { useEffect, useState, useCallback } from "react";
import {
  obtenerTodosEstudiantes,
  obtenerImagenEstudiante,
} from "../../services/estudianteService";
import { obtenerEstudiantesConSeguimientos } from "../../services/seguimientoService";

export const useEstudiantes = ({ soloConSeguimiento }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [fotos, setFotos] = useState({});
  const [cargando, setCargando] = useState(true);
  const [cargandoFotos, setCargandoFotos] = useState(false);

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
      
      // ✅ Mostrar estudiantes inmediatamente
      setCargando(false);
      
      // ✅ Cargar fotos en segundo plano progresivamente
      cargarFotosProgresivamente(res.data);
    } catch (err) {
      console.error("Error al cargar estudiantes:", err);
      setCargando(false);
    }
  };

  const cargarEstudiantesConSeguimiento = async () => {
    try {
      setCargando(true);
      const res = await obtenerEstudiantesConSeguimientos();
      setEstudiantes(res.data);
      
      // ✅ Mostrar estudiantes inmediatamente
      setCargando(false);
      
      // ✅ Cargar fotos en segundo plano
      cargarFotosProgresivamente(res.data);
    } catch (err) {
      console.error("Error al cargar estudiantes con seguimiento:", err);
      setCargando(false);
    }
  };

  // ✅ Cargar fotos una por una, actualizando inmediatamente
  const cargarFotosProgresivamente = async (lista) => {
    setCargandoFotos(true);
    
    // Filtrar solo estudiantes con imagen
    const estudiantesConImagen = lista.filter(est => est.imagen !== null);
    
    // ✅ Cargar fotos en lotes de 5 para mejor rendimiento
    const LOTE = 5;
    for (let i = 0; i < estudiantesConImagen.length; i += LOTE) {
      const lote = estudiantesConImagen.slice(i, i + LOTE);
      
      // Cargar lote en paralelo
      await Promise.allSettled(
        lote.map(async (est) => {
          try {
            const resImg = await obtenerImagenEstudiante(est.id);
            const url = URL.createObjectURL(resImg.data);
            
            // ✅ Actualizar inmediatamente cada foto
            setFotos((prev) => ({ ...prev, [est.id]: url }));
          } catch (error) {
            console.log(`Error al cargar foto del estudiante ${est.id}`);
          }
        })
      );
    }
    
    setCargandoFotos(false);
  };

  const recargar = useCallback(() => {
    // ✅ Limpiar fotos anteriores para evitar duplicados
    setFotos({});
    
    if (soloConSeguimiento) {
      cargarEstudiantesConSeguimiento();
    } else {
      cargarTodosEstudiantes();
    }
  }, [soloConSeguimiento]);

  return {
    estudiantes,
    fotos,
    cargando,
    cargandoFotos, // ✅ Nuevo: indica si aún se están cargando fotos
    recargar,
  };
};