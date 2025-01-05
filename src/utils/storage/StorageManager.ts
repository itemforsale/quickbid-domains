import { Domain } from "@/types/domain";

const STORAGE_KEY = 'quickbid_domains';

export class StorageManager {
  private static instance: StorageManager;
  private broadcastChannel: BroadcastChannel;

  private constructor() {
    this.broadcastChannel = new BroadcastChannel('domainUpdates');
    this.setupBroadcastChannel();
  }

  private setupBroadcastChannel() {
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'storage_update') {
        // Update local storage without broadcasting
        this.saveDomainsWithoutBroadcast(event.data.domains);
      }
    };
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  saveDomains(domains: Domain[]) {
    this.saveDomainsWithoutBroadcast(domains);
    // Broadcast the update to other tabs
    this.broadcastChannel.postMessage({
      type: 'storage_update',
      domains
    });
  }

  private saveDomainsWithoutBroadcast(domains: Domain[]) {
    try {
      const serializedDomains = domains.map(domain => ({
        ...domain,
        endTime: domain.endTime.toISOString(),
        createdAt: domain.createdAt.toISOString(),
        bidTimestamp: domain.bidTimestamp?.toISOString(),
        purchaseDate: domain.purchaseDate?.toISOString(),
        bidHistory: domain.bidHistory.map(bid => ({
          ...bid,
          timestamp: bid.timestamp.toISOString()
        }))
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedDomains));
    } catch (error) {
      console.error('Error saving domains:', error);
    }
  }

  getDomains(): Domain[] {
    try {
      const savedDomains = localStorage.getItem(STORAGE_KEY);
      if (savedDomains) {
        const parsedDomains = JSON.parse(savedDomains);
        return parsedDomains.map(this.parseDomainDates);
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
      createdAt: new Date(domain.createdAt),
      bidTimestamp: domain.bidTimestamp ? new Date(domain.bidTimestamp) : undefined,
      purchaseDate: domain.purchaseDate ? new Date(domain.purchaseDate) : undefined,
      bidHistory: (domain.bidHistory || []).map((bid: any) => ({
        ...bid,
        timestamp: new Date(bid.timestamp)
      }))
    };
  }

  cleanup() {
    this.broadcastChannel.close();
  }
}