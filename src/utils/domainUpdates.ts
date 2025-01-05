import { Domain } from "@/types/domain";

// WebSocket setup
const WS_URL = 'wss://api.60dna.com/ws'; // This is a placeholder URL, replace with your actual WebSocket endpoint
let ws: WebSocket | null = null;

// Default domains data if no data exists in localStorage
const DEFAULT_DOMAINS: Domain[] = [
  {
    id: 1,
    name: "example.com",
    currentBid: 100,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
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

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  if (!ws) {
    ws = new WebSocket(WS_URL);
    
    ws.onmessage = (event) => {
      try {
        const domains = JSON.parse(event.data);
        onUpdate(domains);
        // Broadcast to other tabs
        broadcastChannel.postMessage({ type: 'domains-update', domains });
        // Update localStorage
        localStorage.setItem('quickbid_domains', JSON.stringify(domains));
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      ws = null;
      // Attempt to reconnect after 5 seconds
      setTimeout(() => setupWebSocket(onUpdate), 5000);
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
  localStorage.setItem('quickbid_domains', JSON.stringify(domains));
  broadcastChannel.postMessage({ type: 'domains-update', domains });
};