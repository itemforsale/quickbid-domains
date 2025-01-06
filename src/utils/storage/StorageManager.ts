import { Domain } from "@/types/domain";

const STORAGE_KEY = 'quickbid_domains';
const LAST_UPDATE_KEY = 'quickbid_last_update';

export class StorageManager {
  private static instance: StorageManager;
  private broadcastChannel: BroadcastChannel;
  private domains: Domain[] = [];

  private constructor() {
    this.broadcastChannel = new BroadcastChannel('auctionUpdates');
    this.setupBroadcastChannel();
    this.loadInitialData();
  }

  private setupBroadcastChannel() {
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'storage_update') {
        console.log('Received storage update broadcast:', event.data);
        this.saveDomainsWithoutBroadcast(event.data.domains);
      }
    };
  }

  private loadInitialData() {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        this.domains = JSON.parse(savedData).map(this.parseDomainDates);
        console.log('Loaded initial domains from storage:', this.domains);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  saveDomains(domains: Domain[]) {
    this.domains = domains;
    this.saveDomainsWithoutBroadcast(domains);
    const timestamp = Date.now();
    localStorage.setItem(LAST_UPDATE_KEY, timestamp.toString());
    
    console.log('Broadcasting storage update');
    this.broadcastChannel.postMessage({
      type: 'storage_update',
      domains,
      timestamp
    });
  }

  private saveDomainsWithoutBroadcast(domains: Domain[]) {
    try {
      const serializedDomains = domains.map(domain => ({
        ...domain,
        endTime: domain.endTime instanceof Date ? domain.endTime.toISOString() : domain.endTime,
        createdAt: domain.createdAt instanceof Date ? domain.createdAt.toISOString() : domain.createdAt,
        bidTimestamp: domain.bidTimestamp instanceof Date ? domain.bidTimestamp.toISOString() : domain.bidTimestamp,
        purchaseDate: domain.purchaseDate instanceof Date ? domain.purchaseDate.toISOString() : domain.purchaseDate,
        bidHistory: domain.bidHistory.map(bid => ({
          ...bid,
          timestamp: bid.timestamp instanceof Date ? bid.timestamp.toISOString() : bid.timestamp
        }))
      }));
      
      console.log('Saving domains to localStorage:', serializedDomains);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedDomains));
      this.domains = domains;
    } catch (error) {
      console.error('Error saving domains:', error);
    }
  }

  getDomains(): Domain[] {
    return this.domains;
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

  getLastUpdateTimestamp(): number {
    const timestamp = localStorage.getItem(LAST_UPDATE_KEY);
    return timestamp ? parseInt(timestamp) : 0;
  }

  cleanup() {
    this.broadcastChannel.close();
  }
}