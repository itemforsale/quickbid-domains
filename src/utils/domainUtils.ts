import { Domain } from "@/types/domain";
import { broadcastManager } from "./broadcastManager";

const DOMAINS_STORAGE_KEY = 'quickbid_domains';

export const handleDomainBid = (domains: Domain[], domainId: number, amount: number, username: string): Domain[] => {
  return domains.map(domain => {
    if (domain.id === domainId) {
      return {
        ...domain,
        currentBid: amount,
        currentBidder: username,
        bidHistory: [
          ...domain.bidHistory,
          { bidder: username, amount, timestamp: new Date() }
        ]
      };
    }
    return domain;
  });
};

export const handleDomainBuyNow = (domains: Domain[], domainId: number, username: string): Domain[] => {
  return domains.map(domain => {
    if (domain.id === domainId && domain.buyNowPrice) {
      return {
        ...domain,
        status: 'sold',
        currentBidder: username,
        finalPrice: domain.buyNowPrice,
        purchaseDate: new Date()
      };
    }
    return domain;
  });
};

export const createNewDomain = (
  id: number,
  name: string,
  startingPrice: number,
  buyNowPrice: number | null,
  listedBy: string
): Domain => {
  return {
    id,
    name,
    currentBid: startingPrice,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    bidHistory: [],
    status: 'pending',
    buyNowPrice: buyNowPrice || undefined,
    createdAt: new Date(),
    listedBy,
    featured: false
  };
};

export const categorizeDomains = (domains: Domain[], now: Date, username?: string) => {
  return {
    pendingDomains: domains.filter(d => d.status === 'pending'),
    activeDomains: domains.filter(d => d.status === 'active'),
    endedDomains: domains.filter(d => {
      const endTime = getDateFromComplexStructure(d.endTime);
      return endTime < now && d.status !== 'sold';
    }),
    soldDomains: domains.filter(d => d.status === 'sold'),
    userWonDomains: domains.filter(d => d.currentBidder === username)
  };
};

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
    broadcastManager.broadcast('domains_update', { domains });
  } catch (error) {
    console.error('Error saving domains:', error);
  }
};