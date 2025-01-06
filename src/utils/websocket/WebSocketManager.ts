import { WebSocketConnection } from './WebSocketConnection';
import { VisibilityManager } from './VisibilityManager';
import { MessageHandler } from './MessageHandler';
import { Domain } from '@/types/domain';
import { supabase } from '@/integrations/supabase/client';
import { WebSocketMessage } from '../types/websocket';
import { mapSupabaseToDomain } from '@/types/supabase';

class WebSocketManager {
  private connection: WebSocketConnection;
  private visibilityManager: VisibilityManager;
  private static instance: WebSocketManager;
  private currentCallback: ((message: WebSocketMessage) => void) | null = null;

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
    this.visibilityManager.onVisible(async () => {
      if (this.currentCallback) {
        const { data: domains } = await supabase
          .from('domains')
          .select('*');

        if (domains) {
          const mappedDomains = domains.map(mapSupabaseToDomain);
          this.currentCallback({
            type: 'domains_update',
            domains: mappedDomains
          });
        }
      }
    });
  }

  async connect(callback: (message: WebSocketMessage) => void): Promise<void> {
    this.currentCallback = callback;
    
    const { data: domains } = await supabase
      .from('domains')
      .select('*');

    if (domains) {
      const mappedDomains = domains.map(mapSupabaseToDomain);
      callback({
        type: 'domains_update',
        domains: mappedDomains
      });
    }

    this.connection.connect((message: WebSocketMessage) => {
      MessageHandler.handleIncoming(message, (domains) => {
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