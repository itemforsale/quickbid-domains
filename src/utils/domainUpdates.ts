import { Domain } from "@/types/domain";

const WS_URL = 'wss://api.60dna.com/ws';
let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

// Create a shared channel for cross-window communication
let broadcastChannel: BroadcastChannel | null = null;

try {
  broadcastChannel = new BroadcastChannel('domainUpdates');
} catch (error) {
  console.warn('BroadcastChannel not supported (possibly private window)');
}

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

// Request initial data from other windows and server
const requestInitialData = () => {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'request_initial_data' });
  }
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'get_initial_data' }));
  }
};

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    try {
      ws = new WebSocket(WS_URL);
      
      ws.onopen = () => {
        console.log('WebSocket connection established');
        reconnectAttempts = 0;
        
        // Request initial data from server
        ws.send(JSON.stringify({ type: 'get_initial_data' }));
        
        // Also request data from other windows if possible
        requestInitialData();
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'domains_update' || data.type === 'initial_data') {
            const domains = data.domains;
            onUpdate(domains);
            
            // Broadcast to other windows if possible
            if (broadcastChannel) {
              broadcastChannel.postMessage({ type: 'domains-update', domains });
            }
            
            // Update localStorage
            try {
              localStorage.setItem('quickbid_domains', JSON.stringify(domains));
            } catch (error) {
              console.warn('Unable to save to localStorage (possibly private window)');
            }
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

      // Enhanced BroadcastChannel message handling if available
      if (broadcastChannel) {
        broadcastChannel.onmessage = (event) => {
          if (event.data.type === 'domains-update') {
            onUpdate(event.data.domains);
          } else if (event.data.type === 'request_initial_data') {
            try {
              const savedDomains = localStorage.getItem('quickbid_domains');
              if (savedDomains) {
                broadcastChannel?.postMessage({
                  type: 'domains-update',
                  domains: JSON.parse(savedDomains)
                });
              }
            } catch (error) {
              console.warn('Unable to access localStorage (possibly private window)');
            }
          }
        };
      }

      // Listen for localStorage changes if available
      try {
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
        console.warn('Unable to add storage listener (possibly private window)');
      }

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
  try {
    // First try to get data from localStorage
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
  } catch (error) {
    console.warn('Unable to access localStorage (possibly private window)');
  }

  // If no data in localStorage or error occurred, request it from server and other windows
  requestInitialData();
  
  // Return empty array while waiting for data
  return [];
};

// Helper function to update domains
export const updateDomains = (domains: Domain[]) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ 
      type: 'update_domains',
      domains: domains 
    }));
  }
  try {
    localStorage.setItem('quickbid_domains', JSON.stringify(domains));
  } catch (error) {
    console.warn('Unable to save to localStorage (possibly private window)');
  }
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'domains-update', domains });
  }
};