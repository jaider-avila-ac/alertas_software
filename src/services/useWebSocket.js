import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

const WS_URL      = `ws://${window.location.hostname}:8085/ws`;
const MAX_RETRIES  = 3;   // intentos antes de dejar de reconectar
const RETRY_DELAY  = 15_000; // 15 segundos entre reintentos

/**
 * Hook estable para WebSocket con STOMP.
 * Si el backend no responde, lo intenta MAX_RETRIES veces y se detiene.
 * @param {string[]} topics - Lista de topics a suscribir
 * @param {function} onMessage - Callback(topic, data) cuando llega un mensaje
 */
export default function useWebSocket(topics = [], onMessage) {
  const cbRef    = useRef(onMessage);
  cbRef.current  = onMessage;

  const topicKey = topics.join("|");

  useEffect(() => {
    if (!topicKey) return;

    let retries = 0;

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: RETRY_DELAY,
      onConnect: () => {
        retries = 0;
        topics.forEach((topic) => {
          client.subscribe(topic, (msg) => {
            try {
              cbRef.current(topic, JSON.parse(msg.body));
            } catch (e) {
              console.error("WebSocket parse error:", e);
            }
          });
        });
      },
      onWebSocketError: () => {
        retries++;
        if (retries >= MAX_RETRIES) {
          client.deactivate();
        }
      },
      onStompError: () => {
        retries++;
        if (retries >= MAX_RETRIES) {
          client.deactivate();
        }
      },
    });

    client.activate();
    return () => { if (client.active) client.deactivate(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicKey]);
}
