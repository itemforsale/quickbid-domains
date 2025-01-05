const WS_URL = 'wss://api.60dna.com/ws';
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;
const DNS_STORAGE_KEY = '60dna_domains';

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private onMessageCallback: ((data: any) => void) | null = null;
  private broadcastChannel: BroadcastChannel;
  private pingInterval: NodeJS.Timeout | null = null;
  private lastMessageTime: number = Date.now();

  constructor() {
    this.broadcastChannel = new BroadcastChannel('dnsUpdates');
    this.setupBroadcastChannel();
  }

  private setupBroadcastChannel() {
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'dns_update' && this.onMessageCallback) {
        console.log('Received DNS broadcast update:', event.data);
        this.onMessageCallback(event.data);
      }
    };
  }

  connect(onMessage: (data: any) => void) {
    this.onMessageCallback = onMessage;
    this.initializeWebSocket();
    
    // Initial data load from localStorage
    const storedData = localStorage.getItem(DNS_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log('Loading initial DNS data from localStorage:', parsedData);
        onMessage({ type: 'initial_data', domains: parsedData });
      } catch (error) {
        console.error('Error parsing stored DNS data:', error);
      }
    }
  }

  private initializeWebSocket() {
    try {
      console.log('Initializing DNS WebSocket connection...');
      this.ws = new WebSocket(WS_URL);
      
      this.ws.onopen = () => {
        console.log('DNS WebSocket connection established');
        this.reconnectAttempts = 0;
        this.setupPingInterval();
        this.requestInitialData();
      };
      
      this.ws.onmessage = (event) => {
        this.lastMessageTime = Date.now();
        try {
          const data = JSON.parse(event.data);
          console.log('Received DNS WebSocket message:', data);
          
          if (this.onMessageCallback) {
            this.onMessageCallback(data);
            // Store the latest DNS data in localStorage
            if (data.domains) {
              localStorage.setItem(DNS_STORAGE_KEY, JSON.stringify(data.domains));
            }
            // Broadcast the DNS update to other tabs
            this.broadcastChannel.postMessage({
              type: 'dns_update',
              ...data,
              timestamp: Date.now()
            });
          }
        } catch (error) {
          console.error('DNS WebSocket message parsing error:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('DNS WebSocket error:', error);
        this.handleError(error);
      };

      this.ws.onclose = () => {
        console.log('DNS WebSocket connection closed');
        this.clearPingInterval();
        this.handleError(new Event('connection_closed'));
      };
    } catch (error) {
      console.error('Error initializing DNS WebSocket:', error);
      this.handleError(new Event('initialization_error'));
    }
  }

  private setupPingInterval() {
    this.clearPingInterval();
    this.pingInterval = setInterval(() => {
      if (Date.now() - this.lastMessageTime > 30000) {
        console.log('No DNS messages received recently, checking connection...');
        this.sendPing();
      }
    }, 15000);
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
    console.error('DNS WebSocket error:', error);
    if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      console.log(`Attempting to reconnect DNS (${this.reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})...`);
      setTimeout(() => {
        this.reconnectAttempts++;
        this.initializeWebSocket();
      }, RECONNECT_DELAY);
    } else {
      console.error('Max DNS reconnection attempts reached');
      // Load data from localStorage as fallback
      const storedData = localStorage.getItem(DNS_STORAGE_KEY);
      if (storedData && this.onMessageCallback) {
        try {
          const parsedData = JSON.parse(storedData);
          console.log('Falling back to stored DNS data:', parsedData);
          this.onMessageCallback({
            type: 'fallback_data',
            domains: parsedData
          });
        } catch (error) {
          console.error('Error parsing stored DNS data:', error);
        }
      }
    }
  }

  private requestInitialData() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('Requesting initial DNS data');
      this.ws.send(JSON.stringify({ type: 'get_initial_data' }));
    }
  }

  sendMessage(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('Sending DNS message:', message);
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('DNS WebSocket is not open, message not sent:', message);
      // Try to reconnect if the connection is closed
      if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
        this.initializeWebSocket();
      }
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