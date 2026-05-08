import { useEffect, useRef } from "react";
import { INACTIVITY_TIMEOUT_MS } from "../config/config";

const EVENTS = ["mousemove", "keydown", "click", "touchstart", "scroll"];

/**
 * Detecta inactividad del usuario y ejecuta onTimeout
 * tras INACTIVITY_TIMEOUT_MS milisegundos sin actividad.
 */
export function useInactivity(onTimeout) {
  const timerRef = useRef(null);
  const callbackRef = useRef(onTimeout);

  // Mantener la referencia actualizada sin reiniciar el efecto
  useEffect(() => {
    callbackRef.current = onTimeout;
  });

  useEffect(() => {
    const reset = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(), INACTIVITY_TIMEOUT_MS);
    };

    EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset(); // iniciar el primer timer

    return () => {
      clearTimeout(timerRef.current);
      EVENTS.forEach((e) => window.removeEventListener(e, reset));
    };
  }, []); // solo al montar/desmontar
}