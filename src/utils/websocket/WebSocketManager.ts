const WS_URL = 'wss://api.60dna.com/ws';
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private onMessageCallback: ((data: any) => void) | null = null;

  connect(onMessage: (data: any) => void) {
    this.onMessageCallback = onMessage;
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    try {
      this.ws = new WebSocket(WS_URL);
      
      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.requestInitialData();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (this.onMessageCallback) {
            this.onMessageCallback(data);
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.handleError(new Event('connection_closed'));
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      this.handleError(new Event('initialization_error'));
    }
  }

  private handleError(error: Event) {
    console.error('WebSocket error:', error);
    if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})...`);
      setTimeout(() => {
        this.reconnectAttempts++;
        this.initializeWebSocket();
      }, RECONNECT_DELAY);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private requestInitialData() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'get_initial_data' }));
    }
  }

  sendMessage(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsManager = new WebSocketManager();