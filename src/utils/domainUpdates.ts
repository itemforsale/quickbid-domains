import { Domain } from "@/types/domain";

// WebSocket setup with proper secure WebSocket protocol
const WS_URL = 'wss://api.60dna.com/ws';
let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

// Default domains data if no data exists in localStorage
const DEFAULT_DOMAINS: Domain[] = [
  {
    id: 1,
    name: "example.com",
    currentBid: 100,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: "active",
    bidHistory: [],
    createdAt: new Date(),
    listedBy: "System",
    currentBidder: undefined,
    bidTimestamp: undefined,
    buyNowPrice: null,
    featured: false,
    finalPrice: null,
    purchaseDate: undefined
  }
];

// Broadcast channel for cross-tab communication
const broadcastChannel = new BroadcastChannel('domainUpdates');

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

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    try {
      ws = new WebSocket(WS_URL);
      
      ws.onopen = () => {
        console.log('WebSocket connection established');
        reconnectAttempts = 0; // Reset reconnection attempts on successful connection
        
        // Request initial data
        ws.send(JSON.stringify({ type: 'get_initial_data' }));
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'domains_update') {
            const domains = data.domains;
            onUpdate(domains);
            // Broadcast to other tabs
            broadcastChannel.postMessage({ type: 'domains-update', domains });
            // Update localStorage
            localStorage.setItem('quickbid_domains', JSON.stringify(domains));
          }
          
          // Handle heartbeat to keep connection alive
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

      // Listen for updates from other tabs
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'domains-update') {
          onUpdate(event.data.domains);
        }
      };

      // Listen for localStorage changes
      window.addEventListener('storage', (event) => {
        if (event.key === 'quickbid_domains' && event.newValue) {
          try {
            const domains = JSON.parse(event.newValue);
            onUpdate(domains);
          } catch (error) {
            console.error('Error parsing domains from localStorage:', error);
          }
        }
      });
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
    broadcastChannel.close();
  };
};

export const getDomains = async (): Promise<Domain[]> => {
  const savedDomains = localStorage.getItem('quickbid_domains');
  if (savedDomains) {
    const parsedDomains = JSON.parse(savedDomains);
    return parsedDomains.map((domain: any) => ({
      ...domain,
      endTime: new Date(domain.endTime),
      createdAt: domain.createdAt ? new Date(domain.createdAt) : new Date(),
      bidTimestamp: domain.bidTimestamp ? new Date(domain.bidTimestamp) : undefined,
      purchaseDate: domain.purchaseDate ? new Date(domain.purchaseDate) : undefined,
      bidHistory: (domain.bidHistory || []).map((bid: any) => ({
        ...bid,
        timestamp: new Date(bid.timestamp)
      })),
      listedBy: domain.listedBy || 'Anonymous',
    }));
  }
  return DEFAULT_DOMAINS;
};

// Helper function to update domains
export const updateDomains = (domains: Domain[]) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ 
      type: 'update_domains',
      domains: domains 
    }));
  }
  localStorage.setItem('quickbid_domains', JSON.stringify(domains));
  broadcastChannel.postMessage({ type: 'domains-update', domains });
};
