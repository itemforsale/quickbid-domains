const WS_URL = 'wss://api.60dna.com/ws';
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private onMessageCallback: ((data: any) => void) | null = null;
  private broadcastChannel: BroadcastChannel;
  private pingInterval: NodeJS.Timeout | null = null;
  private lastMessageTime: number = Date.now();

  constructor() {
    this.broadcastChannel = new BroadcastChannel('auctionUpdates');
    this.setupBroadcastChannel();
  }

  private setupBroadcastChannel() {
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'auction_update' && this.onMessageCallback) {
        console.log('Received broadcast update:', event.data);
        this.onMessageCallback(event.data);
      }
    };
  }

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
        this.setupPingInterval();
        this.requestInitialData();
      };
      
      this.ws.onmessage = (event) => {
        this.lastMessageTime = Date.now();
        try {
          const data = JSON.parse(event.data);
          if (this.onMessageCallback) {
            console.log('Received WebSocket message:', data);
            this.onMessageCallback(data);
            // Broadcast the update to other tabs
            this.broadcastChannel.postMessage({
              type: 'auction_update',
              ...data,
              timestamp: Date.now()
            });
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.clearPingInterval();
        this.handleError(new Event('connection_closed'));
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      this.handleError(new Event('initialization_error'));
    }
  }

  private setupPingInterval() {
    this.clearPingInterval();
    this.pingInterval = setInterval(() => {
      if (Date.now() - this.lastMessageTime > 30000) { // 30 seconds
        console.log('No messages received recently, checking connection...');
        this.sendPing();
      }
    }, 15000); // Check every 15 seconds
  }

  private clearPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private sendPing() {
    this.sendMessage({ type: 'ping' });
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
      // Attempt to fallback to localStorage data
      this.fallbackToLocalStorage();
    }
  }

  private fallbackToLocalStorage() {
    const storageManager = new StorageManager();
    const data = storageManager.getDomains();
    if (data && this.onMessageCallback) {
      console.log('Falling back to localStorage data');
      this.onMessageCallback({
        type: 'fallback_data',
        domains: data
      });
    }
  }

  private requestInitialData() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('Requesting initial data');
      this.ws.send(JSON.stringify({ type: 'get_initial_data' }));
    }
  }

  sendMessage(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message);
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not open, message not sent:', message);
    }
  }

  disconnect() {
    this.clearPingInterval();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.broadcastChannel.close();
  }
}

export const wsManager = new WebSocketManager();