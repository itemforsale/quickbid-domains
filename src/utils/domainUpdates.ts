import { Domain } from "@/types/domain";
import { setupWebSocket } from "./domains/websocket";
import { setupBroadcastChannel } from "./domains/broadcast";
import { getStoredDomains } from "./domains/storage";

export const setupDomainUpdates = (onUpdate: (domains: Domain[]) => void) => {
  const cleanupWebSocket = setupWebSocket(onUpdate);
  const cleanupBroadcast = setupBroadcastChannel(onUpdate);

  return () => {
    cleanupWebSocket();
    cleanupBroadcast();
  };
};

export const getDomains = async (): Promise<Domain[]> => {
  const storedData = getStoredDomains();
  if (storedData) {
    return storedData.domains.map((domain: any) => ({
      ...domain,
      endTime: new Date(domain.endTime),
      createdAt: domain.createdAt ? new Date(domain.createdAt) : new Date(),
      bidTimestamp: domain.bidTimestamp ? new Date(domain.bidTimestamp) : undefined,
      purchaseDate: domain.purchaseDate ? new Date(domain.purchaseDate) : undefined,
      bidHistory: (domain.bidHistory || []).map((bid: any) => ({
        ...bid,
        timestamp: new Date(bid.timestamp)
      })),
      listedBy: domain.listedBy || 'Anonymous',
    }));
  }

  return [];
};

// Re-export setupWebSocket for direct usage
export { setupWebSocket } from "./domains/websocket";