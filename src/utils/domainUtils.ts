import { Domain } from "@/types/domain";

export const handleDomainBid = (
  domains: Domain[],
  domainId: number,
  amount: number,
  username: string
): Domain[] => {
  return domains.map((domain) => {
    if (domain.id === domainId) {
      const updatedDomain = {
        ...domain,
        currentBid: amount,
        currentBidder: username,
        bidTimestamp: new Date(),
        bidHistory: [
          ...domain.bidHistory,
          {
            bidder: username,
            amount: amount,
            timestamp: new Date(),
          },
        ],
      };

      if (domain.buyNowPrice && amount >= domain.buyNowPrice) {
        return {
          ...updatedDomain,
          status: 'sold',
          finalPrice: amount,
          purchaseDate: new Date(),
          listedBy: domain.listedBy || 'Anonymous', // Ensure listedBy has a fallback
        };
      }

      return updatedDomain;
    }
    return domain;
  });
};

export const handleDomainBuyNow = (
  domains: Domain[],
  domainId: number,
  username: string
): Domain[] => {
  return domains.map((domain) => {
    if (domain.id === domainId && domain.buyNowPrice) {
      return {
        ...domain,
        status: 'sold',
        currentBid: domain.buyNowPrice,
        currentBidder: username,
        finalPrice: domain.buyNowPrice,
        purchaseDate: new Date(),
        listedBy: domain.listedBy || 'Anonymous', // Ensure listedBy has a fallback
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
  username: string
): Domain => {
  return {
    id,
    name,
    currentBid: startingPrice,
    endTime: new Date(Date.now() + 60 * 60000),
    bidHistory: [],
    status: 'pending',
    buyNowPrice: buyNowPrice || undefined,
    createdAt: new Date(),
    listedBy: username || 'Anonymous', // Ensure listedBy has a fallback
  };
};

export const categorizeDomains = (domains: Domain[], now: Date, username?: string) => {
  const pendingDomains = domains.filter(d => d.status === 'pending');
  const activeDomains = domains.filter(d => 
    d.status === 'active' && d.endTime > now
  );
  const endedDomains = domains.filter(d => 
    d.status === 'active' && d.endTime <= now && d.bidHistory.length === 0
  );
  const soldDomains = domains.filter(d => 
    d.status === 'sold' || 
    (d.status === 'active' && d.endTime <= now && d.bidHistory.length > 0)
  );

  const userWonDomains = soldDomains
    .filter(d => d.currentBidder === username)
    .map(d => ({
      id: d.id,
      name: d.name,
      finalPrice: d.finalPrice!,
      purchaseDate: d.purchaseDate!,
      listedBy: d.listedBy || 'Anonymous',
    }));

  return {
    pendingDomains,
    activeDomains,
    endedDomains,
    soldDomains,
    userWonDomains
  };
};
