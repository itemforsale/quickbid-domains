import { Domain } from "@/types/domain";

const STORAGE_KEY = 'quickbid_domains';

export class StorageManager {
  private static instance: StorageManager;
  private broadcastChannel: BroadcastChannel | null = null;

  private constructor() {
    try {
      this.broadcastChannel = new BroadcastChannel('domainUpdates');
    } catch (error) {
      console.warn('BroadcastChannel not supported');
    }
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  saveDomains(domains: Domain[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(domains));
      this.broadcastUpdate(domains);
    } catch (error) {
      console.error('Error saving domains:', error);
    }
  }

  getDomains(): Domain[] {
    try {
      const savedDomains = localStorage.getItem(STORAGE_KEY);
      if (savedDomains) {
        return JSON.parse(savedDomains).map(this.parseDomainDates);
      }
    } catch (error) {
      console.error('Error reading domains:', error);
    }
    return [];
  }

  private parseDomainDates(domain: any): Domain {
    return {
      ...domain,
      endTime: new Date(domain.endTime),
      createdAt: domain.createdAt ? new Date(domain.createdAt) : new Date(),
      bidTimestamp: domain.bidTimestamp ? new Date(domain.bidTimestamp) : undefined,
      purchaseDate: domain.purchaseDate ? new Date(domain.purchaseDate) : undefined,
      bidHistory: (domain.bidHistory || []).map((bid: any) => ({
        ...bid,
        timestamp: new Date(bid.timestamp)
      }))
    };
  }

  private broadcastUpdate(domains: Domain[]) {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'domains-update',
        domains
      });
    }
  }

  subscribeToUpdates(callback: (domains: Domain[]) => void) {
    if (this.broadcastChannel) {
      this.broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'domains-update') {
          callback(event.data.domains.map(this.parseDomainDates));
        }
      };
    }
  }

  cleanup() {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
  }
}