import { useEffect, useState, useCallback } from "react";
import {
  obtenerTodosEstudiantes,
  obtenerImagenEstudiante,
} from "../../services/estudianteService";
import { obtenerEstudiantesConSeguimientos } from "../../services/seguimientoService";

let _cacheTodos    = null;
let _cacheSeguim   = null;
let _cacheFotos    = {};

export const useEstudiantes = ({ soloConSeguimiento }) => {
  const cache = soloConSeguimiento ? _cacheSeguim : _cacheTodos;

  const [estudiantes, setEstudiantes] = useState(cache ?? []);
  const [fotos,       setFotos]       = useState(_cacheFotos);
  const [cargando,    setCargando]    = useState(!cache);
  const [cargandoFotos, setCargandoFotos] = useState(false);

  const cargarFotos = useCallback(async (lista) => {
    setCargandoFotos(true);
    const conImagen = lista.filter((e) => e.imagen !== null);
    const LOTE = 5;

    for (let i = 0; i < conImagen.length; i += LOTE) {
      const lote = conImagen.slice(i, i + LOTE);
      await Promise.allSettled(
        lote.map(async (est) => {
          if (_cacheFotos[est.id]) return;
          try {
            const res = await obtenerImagenEstudiante(est.id);
            const url = URL.createObjectURL(res.data);
            _cacheFotos = { ..._cacheFotos, [est.id]: url };
            setFotos((prev) => ({ ...prev, [est.id]: url }));
          } catch {
            // foto no disponible, sin acción
          }
        })
      );
    }
    setCargandoFotos(false);
  }, []);

  const cargar = useCallback(async () => {
    try {
      const res = soloConSeguimiento
        ? await obtenerEstudiantesConSeguimientos()
        : await obtenerTodosEstudiantes();

      const datos = res.data;

      if (soloConSeguimiento) _cacheSeguim = datos;
      else                    _cacheTodos  = datos;

      setEstudiantes(datos);
      setCargando(false);
      cargarFotos(datos);
    } catch (err) {
      console.error("Error al cargar estudiantes:", err);
      setCargando(false);
    }
  }, [soloConSeguimiento, cargarFotos]);

  useEffect(() => {
    let active = true;
    setCargando(!cache);

    const run = async () => {
      try {
        const res = soloConSeguimiento
          ? await obtenerEstudiantesConSeguimientos()
          : await obtenerTodosEstudiantes();

        if (!active) return;

        const datos = res.data;
        if (soloConSeguimiento) _cacheSeguim = datos;
        else                    _cacheTodos  = datos;

        setEstudiantes(datos);
        setCargando(false);
        cargarFotos(datos);
      } catch (err) {
        if (active) {
          console.error("Error al cargar estudiantes:", err);
          setCargando(false);
        }
      }
    };

    run();
    return () => { active = false; };
  }, [soloConSeguimiento, cargarFotos]);

  const recargar = useCallback(() => {
    if (soloConSeguimiento) _cacheSeguim = null;
    else                    _cacheTodos  = null;
    _cacheFotos = {};
    setFotos({});
    setCargando(true);
    cargar();
  }, [soloConSeguimiento, cargar]);

  return { estudiantes, fotos, cargando, cargandoFotos, recargar };
};
