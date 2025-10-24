import { useEffect } from "react";
import { Client } from "@stomp/stompjs";

let client = null;

export default function useWebSocket(handlers = {}) {
  useEffect(() => {
    console.log("🔌 Inicializando WebSocket...");

    client = new Client({
      brokerURL: "ws://localhost:8085/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Conectado a WebSocket");

        Object.entries(handlers).forEach(([topic, callback]) => {
          console.log(`📥 Suscrito a ${topic}`);
          client.subscribe(topic, (message) => {
            try {
              const data = JSON.parse(message.body);
              console.log(`📨 Mensaje recibido en ${topic}:`, data);
              callback(data);
            } catch (e) {
              console.error("❌ Error al procesar mensaje WebSocket:", e);
            }
          });
        });
      },
      onStompError: (frame) => {
        console.error("❌ Error STOMP:", frame.headers["message"]);
        console.error("Detalles:", frame.body);
      },
      onWebSocketError: (event) => {
        console.error("❌ Error en conexión WebSocket:", event);
      },
    });

    client.activate();

    return () => {
      if (client && client.active) {
        console.log("🔌 Desconectando WebSocket...");
        client.deactivate();
      }
    };
  }, [handlers]); // Si cambian los handlers, se reactiva
}
