import { DomainUpdate } from "./types";
import { broadcastUpdate } from "./broadcast";
import { isDataStale } from "./storage";

const WS_URL = 'wss://api.60dna.com/ws';
let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

const handleWebSocketError = (error: Event) => {
  console.error('WebSocket error:', error);
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    console.log(`Attempting to reconnect (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})...`);
    setTimeout(() => {
      reconnectAttempts++;
      setupWebSocket(() => {});
    }, RECONNECT_DELAY);
  } else {
    console.error('Max reconnection attempts reached');
  }
};

export const setupWebSocket = (onUpdate: (domains: any[]) => void) => {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    try {
      ws = new WebSocket(WS_URL);
      
      ws.onopen = () => {
        console.log('WebSocket connection established');
        reconnectAttempts = 0;
        ws?.send(JSON.stringify({ type: 'get_initial_data' }));
        broadcastUpdate({ type: 'request_initial_data', timestamp: Date.now() });
      };
      
      ws.onmessage = (event) => {
        try {
          const data: DomainUpdate = JSON.parse(event.data);
          
          if (data.type === 'domains_update' && data.domains) {
            const timestamp = Date.now();
            onUpdate(data.domains);
            broadcastUpdate({ ...data, timestamp });
          }
          
          if (data.type === 'heartbeat') {
            ws?.send(JSON.stringify({ type: 'heartbeat_response' }));
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      ws.onerror = handleWebSocketError;
      ws.onclose = () => {
        console.log('WebSocket connection closed');
        handleWebSocketError(new Event('connection_closed'));
      };
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      handleWebSocketError(new Event('setup_error'));
    }
  }
  
  return () => {
    if (ws) {
      ws.close();
      ws = null;
    }
  };
};