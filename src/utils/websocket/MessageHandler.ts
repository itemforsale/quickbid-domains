import { Domain } from "@/types/domain";

interface WebSocketMessage {
  type: 'domains_update' | 'initial_data' | 'error';
  domains?: Domain[];
  error?: string;
}

export class MessageHandler {
  private static lastBroadcast: number = 0;
  private static readonly THROTTLE_MS: number = 1000;

  static handleIncoming(message: WebSocketMessage, callback: (domains: Domain[]) => void): void {
    switch (message.type) {
      case 'domains_update':
      case 'initial_data':
        if (message.domains) {
          callback(this.processDomains(message.domains));
        }
        break;
      case 'error':
        console.error('WebSocket error:', message.error);
        break;
      default:
        console.warn('Unknown message type:', message);
    }
  }

  private static processDomains(domains: Domain[]): Domain[] {
    return domains.map(domain => ({
      ...domain,
      endTime: domain.endTime,
      createdAt: domain.createdAt,
      bidTimestamp: domain.bidTimestamp,
      purchaseDate: domain.purchaseDate,
      bidHistory: domain.bidHistory.map(bid => ({
        ...bid,
        timestamp: bid.timestamp
      }))
    }));
  }

  static canBroadcast(): boolean {
    const now = Date.now();
    if (now - this.lastBroadcast >= this.THROTTLE_MS) {
      this.lastBroadcast = now;
      return true;
    }
    return false;
  }
}