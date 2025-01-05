import { Domain } from "@/types/domain";

const WS_URL = 'wss://api.60dna.com/ws';
let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

// Create a shared channel for cross-window communication
const broadcastChannel = new BroadcastChannel('domainUpdates');

// Keep track of the last update timestamp
let lastUpdateTimestamp = Date.now();

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

// Request initial data from other windows
const requestInitialData = () => {
  broadcastChannel.postMessage({ 
    type: 'request_initial_data',
    timestamp: Date.now()
  });
};

// Function to check if data is stale
const isDataStale = (timestamp: number) => {
  return Date.now() - timestamp > 5000; // Consider data stale after 5 seconds
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
        
        // Also request data from other windows
        requestInitialData();
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'domains_update') {
            const domains = data.domains;
            lastUpdateTimestamp = Date.now();
            onUpdate(domains);
            
            // Broadcast to other windows with timestamp
            broadcastChannel.postMessage({ 
              type: 'domains-update', 
              domains,
              timestamp: lastUpdateTimestamp
            });
            
            // Update localStorage with timestamp
            localStorage.setItem('quickbid_domains', JSON.stringify({
              domains,
              timestamp: lastUpdateTimestamp
            }));
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

      // Enhanced BroadcastChannel message handling
      broadcastChannel.onmessage = (event) => {
        const { type, domains, timestamp } = event.data;
        
        if (type === 'domains-update' && (!lastUpdateTimestamp || timestamp > lastUpdateTimestamp)) {
          lastUpdateTimestamp = timestamp;
          onUpdate(domains);
          
          // Update localStorage
          localStorage.setItem('quickbid_domains', JSON.stringify({
            domains,
            timestamp
          }));
        } else if (type === 'request_initial_data') {
          // If this window has newer data, share it
          const savedData = localStorage.getItem('quickbid_domains');
          if (savedData) {
            const { domains, timestamp } = JSON.parse(savedData);
            if (timestamp > event.data.timestamp) {
              broadcastChannel.postMessage({
                type: 'domains-update',
                domains,
                timestamp
              });
            }
          }
        }
      };

      // Listen for localStorage changes
      window.addEventListener('storage', (event) => {
        if (event.key === 'quickbid_domains' && event.newValue) {
          try {
            const { domains, timestamp } = JSON.parse(event.newValue);
            if (!lastUpdateTimestamp || timestamp > lastUpdateTimestamp) {
              lastUpdateTimestamp = timestamp;
              onUpdate(domains);
            }
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
    broadcastChannel.close();
    window.removeEventListener('load', requestInitialData);
  };
};

export const getDomains = async (): Promise<Domain[]> => {
  // First try to get data from localStorage
  const savedData = localStorage.getItem('quickbid_domains');
  if (savedData) {
    const { domains, timestamp } = JSON.parse(savedData);
    
    // Check if data is stale
    if (!isDataStale(timestamp)) {
      return domains.map((domain: any) => ({
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
  }

  // If no data in localStorage or data is stale, request it from other windows
  requestInitialData();
  
  // Return empty array while waiting for data
  return [];
};

// Helper function to update domains
export const updateDomains = (domains: Domain[]) => {
  const timestamp = Date.now();
  
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ 
      type: 'update_domains',
      domains: domains 
    }));
  }
  
  localStorage.setItem('quickbid_domains', JSON.stringify({
    domains,
    timestamp
  }));
  
  broadcastChannel.postMessage({ 
    type: 'domains-update', 
    domains,
    timestamp
  });
};
