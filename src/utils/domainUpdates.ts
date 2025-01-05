import { Domain } from "@/types/domain";
import { wsManager } from "./websocket/WebSocketManager";
import { StorageManager } from "./storage/StorageManager";

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  const storageManager = StorageManager.getInstance();

  // Handle WebSocket messages
  wsManager.connect((data) => {
    if (data.type === 'domains_update' || data.type === 'initial_data') {
      const domains = data.domains;
      onUpdate(domains);
      storageManager.saveDomains(domains);
    }
  });

  // Subscribe to storage updates
  storageManager.subscribeToUpdates(onUpdate);

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