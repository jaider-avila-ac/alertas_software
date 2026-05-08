import { useEffect, useRef } from "react";

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos
const EVENTOS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];

export const useInactivityTimer = (onLogout) => {
  const timerRef = useRef(null);

  useEffect(() => {
    const reset = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onLogout, TIMEOUT_MS);
    };

    EVENTOS.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      clearTimeout(timerRef.current);
      EVENTOS.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [onLogout]);
};
