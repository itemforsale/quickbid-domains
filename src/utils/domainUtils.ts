import { Domain } from "@/types/domain";

export const handleDomainBid = (domains: Domain[], domainId: number, amount: number, username: string): Domain[] => {
  return domains.map(domain => {
    if (domain.id === domainId) {
      return {
        ...domain,
        currentBid: amount,
        currentBidder: username,
        bidTimestamp: new Date(),
        bidHistory: [
          ...domain.bidHistory,
          {
            bidder: username,
            amount: amount,
            timestamp: new Date()
          }
        ]
      };
    }
    return domain;
  });
};

export const handleDomainBuyNow = (domains: Domain[], domainId: number, username: string): Domain[] => {
  return domains.map(domain => {
    if (domain.id === domainId) {
      return {
        ...domain,
        status: 'sold',
        currentBidder: username,
        purchaseDate: new Date(),
        finalPrice: domain.buyNowPrice || domain.currentBid
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
  const now = new Date();
  const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

  return {
    id,
    name,
    currentBid: startingPrice,
    endTime,
    bidHistory: [],
    status: 'active',
    buyNowPrice: buyNowPrice || undefined,
    createdAt: now,
    listedBy
  };
};

export const categorizeDomains = (
  domains: Domain[],
  currentTime: Date,
  currentUsername?: string
) => {
  const pendingDomains: Domain[] = [];
  const activeDomains: Domain[] = [];
  const endedDomains: Domain[] = [];
  const soldDomains: Domain[] = [];
  const userWonDomains: { 
    id: number;
    name: string;
    finalPrice: number;
    purchaseDate: Date;
    listedBy: string;
  }[] = [];

  domains.forEach(domain => {
    if (domain.status === 'pending') {
      pendingDomains.push(domain);
    } else if (domain.status === 'sold') {
      soldDomains.push(domain);
      if (currentUsername && domain.currentBidder === currentUsername) {
        userWonDomains.push({
          id: domain.id,
          name: domain.name,
          finalPrice: domain.finalPrice || domain.currentBid,
          purchaseDate: domain.purchaseDate || new Date(),
          listedBy: domain.listedBy
        });
      }
    } else {
      const endTime = new Date(domain.endTime);
      if (endTime > currentTime) {
        activeDomains.push(domain);
      } else {
        endedDomains.push(domain);
      }
    }
  });

  return {
    pendingDomains,
    activeDomains,
    endedDomains,
    soldDomains,
    userWonDomains
  };
};