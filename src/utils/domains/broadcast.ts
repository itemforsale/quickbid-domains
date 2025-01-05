import { DomainUpdate } from "./types";
import { updateLocalStorage } from "./storage";

const broadcastChannel = new BroadcastChannel('domainUpdates');

export const setupBroadcastChannel = (onUpdate: (domains: any[]) => void) => {
  broadcastChannel.onmessage = (event) => {
    const { type, domains, timestamp } = event.data as DomainUpdate;
    
    if (type === 'domains_update' && domains && timestamp) {
      onUpdate(domains);
      updateLocalStorage(domains, timestamp);
    }
  };

  return () => broadcastChannel.close();
};

export const broadcastUpdate = (update: DomainUpdate) => {
  broadcastChannel.postMessage(update);
};