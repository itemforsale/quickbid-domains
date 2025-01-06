import { Domain } from "@/types/domain";
import { getDomains } from "@/utils/domainUpdates";
import { setupWebSocket } from "@/utils/domainUpdates";

export class WebSocketManager {
  private domains: Domain[] = [];
  private onUpdateCallback: ((domains: Domain[]) => void) | null = null;
  private cleanup: (() => void) | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      const initialDomains = await getDomains();
      this.domains = initialDomains;
      this.notifyUpdate();
    } catch (error) {
      console.error('Error initializing WebSocketManager:', error);
    }
  }

  public subscribe(callback: (domains: Domain[]) => void) {
    this.onUpdateCallback = callback;
    this.notifyUpdate();

    if (!this.cleanup) {
      this.cleanup = setupWebSocket(async (domains) => {
        this.domains = domains;
        this.notifyUpdate();
      });
    }

    return () => {
      if (this.cleanup) {
        this.cleanup();
        this.cleanup = null;
      }
      this.onUpdateCallback = null;
    };
  }

  private notifyUpdate() {
    if (this.onUpdateCallback) {
      this.onUpdateCallback(this.domains);
    }
  }
}