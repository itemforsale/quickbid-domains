class BroadcastManager {
  private static instance: BroadcastManager;
  private channel: BroadcastChannel;
  private lastBroadcastTime: number = 0;
  private readonly BROADCAST_THROTTLE = 1000; // 1 second throttle

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
    const now = Date.now();
    if (now - this.lastBroadcastTime >= this.BROADCAST_THROTTLE) {
      console.log(`Broadcasting ${type}:`, data);
      this.channel.postMessage({ type, data });
      this.lastBroadcastTime = now;
    } else {
      console.log('Broadcast throttled');
    }
  }

  public cleanup() {
    this.channel.close();
  }
}

export const broadcastManager = BroadcastManager.getInstance();