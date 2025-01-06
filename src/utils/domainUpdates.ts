import { Domain } from "@/types/domain";
import { wsManager } from "./websocket/WebSocketManager";
import { StorageManager } from "./storage/StorageManager";
import { WebSocketMessage } from "./types/websocket";

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  const storageManager = StorageManager.getInstance();
  
  // Initial load from localStorage
  const initialDomains = storageManager.getDomains();
  if (initialDomains && initialDomains.length > 0) {
    console.log('Loading initial domains from storage:', initialDomains);
    onUpdate(initialDomains);
  }

  // Handle WebSocket messages
  wsManager.connect((domains: Domain[]) => {
    console.log('Received domains update:', domains);
    storageManager.saveDomains(domains);
    onUpdate(domains);
  });

  return () => {
    wsManager.disconnect();
    storageManager.cleanup();
  };
};

export const getDomains = async (): Promise<Domain[]> => {
  console.log('Getting domains...');
  const storageManager = StorageManager.getInstance();
  const domains = storageManager.getDomains();
  console.log('Retrieved domains:', domains);
  return domains || [];
};

export const updateDomains = (domains: Domain[]) => {
  console.log('Updating domains:', domains);
  const storageManager = StorageManager.getInstance();
  storageManager.saveDomains(domains);
  wsManager.sendMessage({ 
    type: 'update_domains',
    domains 
  });
};