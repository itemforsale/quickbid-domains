import { Domain } from "@/types/domain";
import { wsManager } from "./websocket/WebSocketManager";
import { StorageManager } from "./storage/StorageManager";

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  const storageManager = StorageManager.getInstance();

  // Handle WebSocket messages
  wsManager.connect((data) => {
    if (data.type === 'domains_update' || data.type === 'initial_data') {
      const domains = data.domains.map((domain: any) => ({
        ...domain,
        endTime: new Date(domain.endTime),
        createdAt: new Date(domain.createdAt),
        bidTimestamp: domain.bidTimestamp ? new Date(domain.bidTimestamp) : undefined,
        purchaseDate: domain.purchaseDate ? new Date(domain.purchaseDate) : undefined,
        bidHistory: (domain.bidHistory || []).map((bid: any) => ({
          ...bid,
          timestamp: new Date(bid.timestamp)
        }))
      }));
      onUpdate(domains);
      storageManager.saveDomains(domains);
    }
  });

  return () => {
    wsManager.disconnect();
    storageManager.cleanup();
  };
};

export const getDomains = async (): Promise<Domain[]> => {
  const storageManager = StorageManager.getInstance();
  return storageManager.getDomains();
};

export const updateDomains = (domains: Domain[]) => {
  const storageManager = StorageManager.getInstance();
  wsManager.sendMessage({ 
    type: 'update_domains',
    domains 
  });
  storageManager.saveDomains(domains);
};