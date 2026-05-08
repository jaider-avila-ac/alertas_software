import { useEffect, useRef } from "react";
import { API_BASE_URL } from "../config/config";

export function useSessionEvents(token, onForzada) {
  const onForzadaRef = useRef(onForzada);
  onForzadaRef.current = onForzada;

  useEffect(() => {
    if (!token) return;

    const url = `${API_BASE_URL}/auth/mi-sesion/eventos?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    es.addEventListener("sesion-forzada", e => {
      try {
        const data = JSON.parse(e.data);
        onForzadaRef.current(data);
      } catch { /* ignore malformed */ }
      es.close();
    });

    es.onerror = () => es.close();

    return () => es.close();
  }, [token]);
}
