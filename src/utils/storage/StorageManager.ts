import { Domain } from "@/types/domain";

const STORAGE_KEY = 'quickbid_domains';
const LAST_UPDATE_KEY = 'quickbid_last_update';
const USERS_KEY = 'quickbid_users';

export class StorageManager {
  private static instance: StorageManager;
  private broadcastChannel: BroadcastChannel;
  private domains: Domain[] = [];

  private constructor() {
    this.broadcastChannel = new BroadcastChannel('auctionUpdates');
    this.setupBroadcastChannel();
    this.setupStorageListener();
    this.loadInitialData();
  }

  private setupBroadcastChannel() {
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'storage_update') {
        console.log('Received storage update broadcast:', event.data);
        this.saveDomainsWithoutBroadcast(event.data.domains);
      } else if (event.data.type === 'users_update') {
        console.log('Received users update broadcast:', event.data);
        localStorage.setItem(USERS_KEY, JSON.stringify(event.data.users));
        window.dispatchEvent(new Event('users_updated'));
      }
    };
  }

  private setupStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY) {
        const newDomains = event.newValue ? JSON.parse(event.newValue) : [];
        this.domains = newDomains.map(this.parseDomainDates);
        window.dispatchEvent(new Event('domains_updated'));
      } else if (event.key === USERS_KEY) {
        window.dispatchEvent(new Event('users_updated'));
      }
    });
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

  saveUsers(users: any[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    this.broadcastChannel.postMessage({
      type: 'users_update',
      users,
      timestamp: Date.now()
    });
  }

  private saveDomainsWithoutBroadcast(domains: Domain[]) {
    try {
      const serializedDomains = domains.map(domain => ({
        ...domain,
        endTime: domain.endTime instanceof Date ? domain.endTime.toISOString() : 
                typeof domain.endTime === 'string' ? domain.endTime :
                domain.endTime?.value?.iso || new Date().toISOString(),
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

  getUsers(): any[] {
    const usersData = localStorage.getItem(USERS_KEY);
    return usersData ? JSON.parse(usersData) : [];
  }

  private parseDomainDates(domain: any): Domain {
    return {
      ...domain,
      endTime: domain.endTime instanceof Date ? domain.endTime : 
               typeof domain.endTime === 'string' ? new Date(domain.endTime) :
               domain.endTime?.value?.iso ? new Date(domain.endTime.value.iso) : new Date(),
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