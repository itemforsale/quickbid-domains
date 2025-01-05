import { Domain } from "@/types/domain";

// WebSocket setup
const WS_URL = 'wss://api.60dna.com/ws'; // This is a placeholder URL, replace with your actual WebSocket endpoint
let ws: WebSocket | null = null;

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  if (!ws) {
    ws = new WebSocket(WS_URL);
    
    ws.onmessage = (event) => {
      try {
        const domains = JSON.parse(event.data);
        onUpdate(domains);
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
  }
  
  return () => {
    if (ws) {
      ws.close();
      ws = null;
    }
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