import { Domain } from "@/types/domain";

const DOMAINS_STORAGE_KEY = 'quickbid_domains';

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  // Initial load from localStorage
  const initialDomains = getDomains();
  if (initialDomains && initialDomains.length > 0) {
    console.log('Loading initial domains from storage:', initialDomains);
    onUpdate(initialDomains);
  }

  // Handle WebSocket messages
  wsManager.connect((message: WebSocketMessage) => {
    if (message.type === 'domains_update' && Array.isArray(message.domains)) {
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
      type: 'domains_update',
      domains 
    });
  } catch (error) {
    console.error('Error saving domains:', error);
  }
}

export const getDateFromComplexStructure = (dateValue: Date | string | { value: { iso: string } }): Date => {
  if (dateValue instanceof Date) {
    return dateValue;
  }
  if (typeof dateValue === 'string') {
    return new Date(dateValue);
  }
  if (dateValue && typeof dateValue === 'object' && 'value' in dateValue && dateValue.value && 'iso' in dateValue.value) {
    return new Date(dateValue.value.iso);
  }
  return new Date();
};
