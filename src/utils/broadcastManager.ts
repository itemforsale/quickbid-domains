class BroadcastManager {
  private static instance: BroadcastManager;
  private channel: BroadcastChannel;

  private constructor() {
    this.channel = new BroadcastChannel('domain_updates');
    this.setupListeners();
  }

  public static getInstance(): BroadcastManager {
    if (!BroadcastManager.instance) {
      BroadcastManager.instance = new BroadcastManager();
    }
    return BroadcastManager.instance;
  }

  private setupListeners() {
    this.channel.onmessage = (event) => {
      const { type, data } = event.data;
      
      // Dispatch custom event that components can listen to
      window.dispatchEvent(new CustomEvent('domain_update', {
        detail: { type, data }
      }));
    };
  }

  public broadcast(type: string, data: any) {
    this.channel.postMessage({ type, data });
  }

  public cleanup() {
    this.channel.close();
  }
}

export const broadcastManager = BroadcastManager.getInstance();