import { useEffect } from "react";
import { get } from "../api/api";

const PING_TIMEOUT_MS  = 6000;
const PING_INTERVAL_MS = 30_000; // cada 30 segundos

export const usePing = (onFailure) => {
  useEffect(() => {
    const ping = () =>
      get("/ping", { timeout: PING_TIMEOUT_MS }).catch((err) => {
        if (!err.response) onFailure(); // solo cuando el servidor es inalcanzable
      });

    ping(); // al montar (recarga de página o primer ingreso)

    const intervalo = setInterval(ping, PING_INTERVAL_MS);
    return () => clearInterval(intervalo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
