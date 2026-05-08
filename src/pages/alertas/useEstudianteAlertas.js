import { useState, useEffect } from "react";
import { procesarConsultas } from "../../utils/procesarConsultas";

let _cache = null;

const agrupar = (datos) => {
  const mapa = {};
  datos.forEach((c) => {
    const key = c.estudianteId;
    if (!mapa[key]) {
      mapa[key] = {
        estudianteId:     c.estudianteId,
        nombreEstudiante: c.nombreEstudiante || "Sin nombre",
        total:            0,
        pendientes:       0,
      };
    }
    mapa[key].total += 1;
    if (c.estado === "pendiente") mapa[key].pendientes += 1;
  });
  return Object.values(mapa).sort((a, b) => b.total - a.total);
};

export const useEstudianteAlertas = () => {
  const [grupos,   setGrupos]   = useState(_cache ?? []);
  const [cargando, setCargando] = useState(!_cache);

  useEffect(() => {
    let active = true;

    procesarConsultas()
      .then((datos) => {
        if (!active) return;
        const result = agrupar(datos);
        _cache = result;
        setGrupos(result);
      })
      .catch((err) => console.error("Error cargando grupos de alertas:", err))
      .finally(() => { if (active) setCargando(false); });

    return () => { active = false; };
  }, []);

  return { grupos, cargando };
};
