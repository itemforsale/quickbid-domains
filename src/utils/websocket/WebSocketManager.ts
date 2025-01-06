import { WebSocketConnection } from './WebSocketConnection';
import { VisibilityManager } from './VisibilityManager';
import { MessageHandler } from './MessageHandler';
import { Domain } from '@/types/domain';
import { StorageManager } from '../storage/StorageManager';

interface WebSocketMessage {
  type: 'domains_update' | 'initial_data';
  domains: Domain[];
}

class WebSocketManager {
  private connection: WebSocketConnection;
  private visibilityManager: VisibilityManager;
  private static instance: WebSocketManager;
  private currentCallback: ((domains: Domain[]) => void) | null = null;
  private storageManager: StorageManager;

  private constructor() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'wss://api.60dna.com/ws';
    this.connection = new WebSocketConnection(wsUrl);
    this.visibilityManager = new VisibilityManager();
    this.storageManager = StorageManager.getInstance();
    
    this.setupVisibilityHandler();
  }

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private setupVisibilityHandler(): void {
    this.visibilityManager.onVisible(() => {
      if (this.currentCallback) {
        // Load from storage when tab becomes visible
        const storedDomains = this.storageManager.getDomains();
        if (storedDomains.length > 0) {
          this.currentCallback(storedDomains);
        }
        this.connect(this.currentCallback);
      }
    });
  }

  connect(callback: (domains: Domain[]) => void): void {
    this.currentCallback = callback;
    
    // First load from storage
    const storedDomains = this.storageManager.getDomains();
    if (storedDomains.length > 0) {
      callback(storedDomains);
    }

    // Then connect to WebSocket for live updates
    this.connection.connect((message: WebSocketMessage) => {
      MessageHandler.handleIncoming(message, (domains) => {
        this.storageManager.saveDomains(domains);
        callback(domains);
      });
    });
  }

  disconnect(): void {
    this.connection.disconnect();
    this.visibilityManager.cleanup();
  }

  sendMessage(message: any): void {
    if (MessageHandler.canBroadcast()) {
      this.connection.send(message);
    }
  }
}

export const wsManager = WebSocketManager.getInstance();