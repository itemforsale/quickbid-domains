import { Domain } from "@/types/domain";
import { wsManager } from "./websocket/WebSocketManager";
import { StorageManager } from "./storage/StorageManager";
import { WebSocketMessage } from "./types/websocket";

const DOMAINS_STORAGE_KEY = 'quickbid_domains';

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  const storageManager = StorageManager.getInstance();
  
  // Initial load from localStorage
  const initialDomains = getDomains();
  if (initialDomains && initialDomains.length > 0) {
    console.log('Loading initial domains from storage:', initialDomains);
    onUpdate(initialDomains);
  }

  // Handle WebSocket messages
  wsManager.connect((message: WebSocketMessage) => {
    if (message.type === 'update_domains' && Array.isArray(message.domains)) {
      console.log('Received domains update:', message.domains);
      localStorage.setItem(DOMAINS_STORAGE_KEY, JSON.stringify(message.domains));
      onUpdate(message.domains);
    }
  });

  return () => {
    wsManager.disconnect();
  };
};

export const getDomains = (): Domain[] => {
  try {
    const savedDomains = localStorage.getItem(DOMAINS_STORAGE_KEY);
    const domains = savedDomains ? JSON.parse(savedDomains) : [];
    console.log('Retrieved domains:', domains);
    return domains;
  } catch (error) {
    console.error('Error loading domains:', error);
    return [];
  }
};

export const updateDomains = (domains: Domain[]) => {
  try {
    console.log('Updating domains:', domains);
    localStorage.setItem(DOMAINS_STORAGE_KEY, JSON.stringify(domains));
    wsManager.sendMessage({ 
      type: 'update_domains',
      domains 
    });
  } catch (error) {
    console.error('Error saving domains:', error);
  }
};