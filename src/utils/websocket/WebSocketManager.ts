import { Domain } from "@/types/domain";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export class WebSocketManager {
  private static instance: WebSocketManager;
  private subscribers: ((domains: Domain[]) => void)[] = [];
  private channel: any;

  private constructor() {
    this.setupRealtimeSubscription();
  }

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private setupRealtimeSubscription() {
    this.channel = supabase
      .channel('public:domains')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'domains' 
        }, 
        async () => {
          await this.fetchAndNotifySubscribers();
        }
      )
      .subscribe();
  }

  private async fetchAndNotifySubscribers() {
    try {
      const { data, error } = await supabase
        .from('domains')
        .select('*');

      if (error) throw error;

      const domains = data.map(d => ({
        id: d.id,
        name: d.name,
        currentBid: d.current_bid,
        endTime: new Date(d.end_time),
        bidHistory: d.bid_history || [],
        status: d.status,
        currentBidder: d.current_bidder,
        bidTimestamp: d.bid_timestamp,
        buyNowPrice: d.buy_now_price,
        finalPrice: d.final_price,
        purchaseDate: d.purchase_date,
        featured: d.featured,
        createdAt: d.created_at,
        listedBy: d.listed_by,
        isFixedPrice: d.is_fixed_price
      }));

      this.subscribers.forEach(callback => callback(domains));
    } catch (error) {
      console.error('Error fetching domains:', error);
      toast.error('Failed to fetch latest domain updates');
    }
  }

  subscribe(callback: (domains: Domain[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  cleanup() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
    }
    this.subscribers = [];
  }
}

export default WebSocketManager;