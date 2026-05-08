import { useState, useEffect, useCallback, useMemo } from "react";
import { guardarCalificacionIndividual, guardarCalificaciones } from "../../../services/calificaciones.service";

export function useCalificaciones({ 
  configNotas, 
  estudiantes, 
  valoresIniciales,
  asignacionId,
  anioId 
}) {
  const [edits, setEdits] = useState(new Map());
  const [saving, setSaving] = useState(false);
  const [promedios, setPromedios] = useState(new Map());
  const [valoresCache, setValoresCache] = useState(valoresIniciales);

  // Actualizar cache cuando cambian valores iniciales
  useEffect(() => {
    setValoresCache(valoresIniciales);  //erro Calling setState Synchonusly
   
  }, [valoresIniciales]);

  // Agrupar configuraciones por corte
  const { notasPorCorte, cortesOrdenados } = useMemo(() => {
    const agrupado = {};
    configNotas.forEach(n => {
      if (!agrupado[n.corte]) agrupado[n.corte] = [];
      agrupado[n.corte].push(n);
    });
    const ordenados = Object.keys(agrupado).map(Number).sort((a, b) => a - b);
    return { notasPorCorte: agrupado, cortesOrdenados: ordenados };
  }, [configNotas]);

  // Obtener valor actual (edits o valor en cache)
  const getValorActual = useCallback((estudianteId, configId, corte) => {
    const key = `${estudianteId}|${configId}|${corte}`;
    if (edits.has(key)) return edits.get(key);
    const valor = valoresCache.get(key);
    return valor === null || valor === undefined ? "" : valor;
  }, [edits, valoresCache]);

  // Calcular promedio de un estudiante
  const calcularPromedioEstudiante = useCallback((estudianteId) => {
    const promediosPorCorte = [];
    
    for (const corte of cortesOrdenados) {
      const notasCorte = notasPorCorte[corte];
      let suma = 0;
      let sumaPonderacion = 0;
      
      for (const cfg of notasCorte) {
        const valor = getValorActual(estudianteId, cfg.id, corte);
        if (valor !== "" && valor !== null && valor !== undefined) {
          const numValor = Number(valor);
          if (!isNaN(numValor)) {
            const porcentaje = Number(cfg.porcentaje) || 0;
            suma += numValor * porcentaje;
            sumaPonderacion += porcentaje;
          }
        }
      }
      
      if (sumaPonderacion > 0) {
        promediosPorCorte.push(suma / sumaPonderacion);
      }
    }
    
    if (promediosPorCorte.length === 0) return null;
    return promediosPorCorte.reduce((a, b) => a + b, 0) / promediosPorCorte.length;
  }, [cortesOrdenados, notasPorCorte, getValorActual]);

  // Actualizar promedios cuando cambian edits
  useEffect(() => {
    const nuevosPromedios = new Map();
    estudiantes.forEach(est => {
      const promedio = calcularPromedioEstudiante(est.id);
      if (promedio !== null) {
        nuevosPromedios.set(est.id, promedio);
      }
    });
    setPromedios(nuevosPromedios);  //   //erro Calling setState Synchonusly
  }, [edits, estudiantes, calcularPromedioEstudiante]);

  // Guardar valor individual (llamado desde onBlur)
  const guardarValor = async (estudianteId, configId, corte, value) => {
    const key = `${estudianteId}|${configId}|${corte}`;
    const valorNum = value === "" ? null : Number(value);

    const limpiarEdit = () => setEdits(prev => { const m = new Map(prev); m.delete(key); return m; });

    if (valorNum === null || isNaN(valorNum) || valorNum < 0 || valorNum > 5) {
      // Valor fuera de rango o vacío → revertir al valor guardado
      limpiarEdit();
      return;
    }

    const valorRedondeado = Math.round(valorNum * 10) / 10;
    try {
      await guardarCalificacionIndividual(asignacionId, anioId, {
        estudianteId,
        corte,
        configuracionNotaId: configId,
        valor: valorRedondeado,
      });
      setValoresCache(prev => { const m = new Map(prev); m.set(key, valorRedondeado); return m; });
      limpiarEdit();
    } catch (error) {
      console.error("Error guardando nota:", error);
    }
  };

  // Manejar cambio de input (solo actualiza estado local)
  const handleInputChange = (estudianteId, configId, corte, value) => {
    const key = `${estudianteId}|${configId}|${corte}`;
    setEdits(prev => {
      const newMap = new Map(prev);
      if (value === "") {
        newMap.delete(key);
      } else {
        newMap.set(key, value);
      }
      return newMap;
    });
  };

  // Guardar todas las notas pendientes
  const guardarTodas = async () => {
    if (edits.size === 0) return;
    
    setSaving(true);
    try {
      const payload = [];
      const keysToUpdate = [];
      
      for (const [key, valor] of edits) {
        if (valor !== "" && !isNaN(Number(valor))) {
          const [estudianteId, configId, corte] = key.split("|").map(Number);
          const valorNum = Math.round(Number(valor) * 10) / 10;
          if (valorNum >= 0 && valorNum <= 5) {
            payload.push({ estudianteId, corte, configuracionNotaId: configId, valor: valorNum });
            keysToUpdate.push({ key, valorNum });
          }
        }
      }
      
      if (payload.length > 0) {
        // Guardar en backend usando el servicio
        await guardarCalificaciones(asignacionId, anioId, payload);
        
        // Actualizar cache local
        setValoresCache(prev => {
          const newMap = new Map(prev);
          keysToUpdate.forEach(({ key, valorNum }) => {
            newMap.set(key, valorNum);
          });
          return newMap;
        });
        
        // Limpiar edits
        setEdits(new Map());
      }
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = edits.size > 0;

  // Verifica si todos los estudiantes tienen todas las notas del corte GUARDADAS
  const esCortecompleto = useCallback((corte) => {
    const notas = notasPorCorte[corte] || [];
    if (notas.length === 0 || estudiantes.length === 0) return false;
    return estudiantes.every(est =>
      notas.every(cfg => {
        const key = `${est.id}|${cfg.id}|${corte}`;
        const valor = valoresCache.get(key);
        return valor !== null && valor !== undefined && valor !== "";
      })
    );
  }, [notasPorCorte, estudiantes, valoresCache]);

  // Un corte está bloqueado si el corte anterior no está completo
  const esCorteBloqueado = useCallback((corte) => {
    const idx = cortesOrdenados.indexOf(corte);
    if (idx === 0) return false;
    return !esCortecompleto(cortesOrdenados[idx - 1]);
  }, [cortesOrdenados, esCortecompleto]);

  // Promedio ponderado de un estudiante en un corte específico
  const calcularPromedioCorte = useCallback((estudianteId, corte) => {
    const notas = notasPorCorte[corte] || [];
    let suma = 0, peso = 0;
    notas.forEach(cfg => {
      const v = getValorActual(estudianteId, cfg.id, corte);
      if (v !== "" && v !== null && v !== undefined) {
        const n = Number(v);
        if (!isNaN(n)) {
          suma += n * Number(cfg.porcentaje || 0);
          peso += Number(cfg.porcentaje || 0);
        }
      }
    });
    return peso > 0 ? suma / peso : null;
  }, [notasPorCorte, getValorActual]);

  return {
    notasPorCorte,
    cortesOrdenados,
    getValorActual,
    promedios,
    handleInputChange,
    guardarValor,
    guardarTodas,
    hasChanges,
    saving,
    editsCount: edits.size,
    esCortecompleto,
    esCorteBloqueado,
    calcularPromedioCorte,
  };
}