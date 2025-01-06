import { WebSocketConnection } from './WebSocketConnection';
import { VisibilityManager } from './VisibilityManager';
import { MessageHandler } from './MessageHandler';
import { Domain } from '@/types/domain';

interface WebSocketMessage {
  type: 'domains_update' | 'initial_data';
  domains: Domain[];
}

class WebSocketManager {
  private connection: WebSocketConnection;
  private visibilityManager: VisibilityManager;
  private static instance: WebSocketManager;
  private currentCallback: ((domains: Domain[]) => void) | null = null;

  private constructor() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'wss://api.60dna.com/ws';
    this.connection = new WebSocketConnection(wsUrl);
    this.visibilityManager = new VisibilityManager();
    
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
        this.connect(this.currentCallback);
      }
    });
  }

  connect(callback: (domains: Domain[]) => void): void {
    this.currentCallback = callback;
    this.connection.connect((message: WebSocketMessage) => {
      MessageHandler.handleIncoming(message, callback);
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