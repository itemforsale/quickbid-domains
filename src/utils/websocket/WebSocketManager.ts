import { WebSocketConnection } from './WebSocketConnection';
import { VisibilityManager } from './VisibilityManager';
import { MessageHandler } from './MessageHandler';
import { Domain } from '@/types/domain';
import { StorageManager } from '../storage/StorageManager';
import { WebSocketMessage } from '../types/websocket';

class WebSocketManager {
  private connection: WebSocketConnection;
  private visibilityManager: VisibilityManager;
  private static instance: WebSocketManager;
  private currentCallback: ((message: WebSocketMessage) => void) | null = null;
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
        const storedDomains = this.storageManager.getDomains();
        if (storedDomains.length > 0) {
          this.currentCallback({
            type: 'domains_update',
            domains: storedDomains
          });
        }
      }
    });
  }

  connect(callback: (message: WebSocketMessage) => void): void {
    this.currentCallback = callback;
    
    const storedDomains = this.storageManager.getDomains();
    if (storedDomains.length > 0) {
      callback({
        type: 'domains_update',
        domains: storedDomains
      });
    }

    this.connection.connect((message: WebSocketMessage) => {
      MessageHandler.handleIncoming(message, (domains) => {
        this.storageManager.saveDomains(domains);
        callback({
          type: 'domains_update',
          domains
        });
      });
    });
  }

  disconnect(): void {
    this.connection.disconnect();
    this.visibilityManager.cleanup();
  }

  sendMessage(message: WebSocketMessage): void {
    if (MessageHandler.canBroadcast()) {
      this.connection.send(message);
    }
  }
}

export const wsManager = WebSocketManager.getInstance();