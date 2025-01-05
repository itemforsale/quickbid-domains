import { Domain } from "@/types/domain";

const WS_URL = 'wss://api.60dna.com/ws';
let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

// Fallback data storage for private windows
let inMemoryDomains: Domain[] = [];

const createBroadcastChannel = () => {
  try {
    return new BroadcastChannel('domainUpdates');
  } catch (error) {
    console.warn('BroadcastChannel not supported');
    return null;
  }
};

let broadcastChannel = createBroadcastChannel();

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

const requestInitialData = () => {
  // Request data from other windows
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'request_initial_data' });
  }
  // Request data from server
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'get_initial_data' }));
  }
};

const broadcastUpdate = (domains: Domain[]) => {
  // Update in-memory storage
  inMemoryDomains = domains;

  // Try to update localStorage if available
  try {
    localStorage.setItem('quickbid_domains', JSON.stringify(domains));
  } catch (error) {
    console.warn('Unable to save to localStorage');
  }

  // Try to broadcast to other windows if available
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'domains-update', domains });
    } catch (error) {
      console.warn('Unable to broadcast update');
      // Try to recreate broadcast channel if it failed
      broadcastChannel = createBroadcastChannel();
    }
  }
};

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    try {
      ws = new WebSocket(WS_URL);
      
      ws.onopen = () => {
        console.log('WebSocket connection established');
        reconnectAttempts = 0;
        requestInitialData();
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'domains_update' || data.type === 'initial_data') {
            const domains = data.domains;
            onUpdate(domains);
            broadcastUpdate(domains);
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

      // Set up BroadcastChannel message handling if available
      if (broadcastChannel) {
        broadcastChannel.onmessage = (event) => {
          if (event.data.type === 'domains-update') {
            onUpdate(event.data.domains);
          } else if (event.data.type === 'request_initial_data') {
            // Share data with other windows if we have it
            if (inMemoryDomains.length > 0) {
              broadcastChannel?.postMessage({
                type: 'domains-update',
                domains: inMemoryDomains
              });
            }
          }
        };
      }

      // Listen for storage events to sync across tabs
      window.addEventListener('storage', (event) => {
        if (event.key === 'quickbid_domains' && event.newValue) {
          try {
            const domains = JSON.parse(event.newValue);
            onUpdate(domains);
            inMemoryDomains = domains;
          } catch (error) {
            console.error('Error parsing domains from localStorage:', error);
          }
        }
      });

      // Request initial data when the page loads
      window.addEventListener('load', requestInitialData);
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
    if (broadcastChannel) {
      broadcastChannel.close();
    }
    window.removeEventListener('load', requestInitialData);
  };
};

export const getDomains = async (): Promise<Domain[]> => {
  // First try to get data from in-memory storage
  if (inMemoryDomains.length > 0) {
    return inMemoryDomains;
  }

  // Then try localStorage
  try {
    const savedDomains = localStorage.getItem('quickbid_domains');
    if (savedDomains) {
      const parsedDomains = JSON.parse(savedDomains).map((domain: any) => ({
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
      inMemoryDomains = parsedDomains;
      return parsedDomains;
    }
  } catch (error) {
    console.warn('Unable to access localStorage');
  }

  // If no data is available, request it from the server
  requestInitialData();
  return [];
};

export const updateDomains = (domains: Domain[]) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ 
      type: 'update_domains',
      domains: domains 
    }));
  }
  broadcastUpdate(domains);
};