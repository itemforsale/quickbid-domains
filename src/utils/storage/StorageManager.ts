import { supabase } from "@/integrations/supabase/client";
import { Domain } from "@/types/domain";

export class StorageManager {
  private static instance: StorageManager;
  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  async getDomains(): Promise<Domain[]> {
    try {
      const { data, error } = await supabase
        .from('domains')
        .select('*');

      if (error) throw error;

      return data.map(d => ({
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
    } catch (error) {
      console.error('Error loading domains:', error);
      return [];
    }
  }

  async saveDomains(domains: Domain[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('domains')
        .upsert(
          domains.map(d => ({
            id: d.id,
            name: d.name,
            current_bid: d.currentBid,
            end_time: d.endTime.toISOString(),
            bid_history: d.bidHistory,
            status: d.status,
            current_bidder: d.currentBidder,
            bid_timestamp: d.bidTimestamp,
            buy_now_price: d.buyNowPrice,
            final_price: d.finalPrice,
            purchase_date: d.purchaseDate,
            featured: d.featured,
            created_at: d.createdAt,
            listed_by: d.listedBy,
            is_fixed_price: d.isFixedPrice
          }))
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error saving domains:', error);
    }
  }

  async getUsers(): Promise<any[]> {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) throw error;
    return profiles || [];
  }

  async saveUsers(users: any[]): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .upsert(users);

    if (error) throw error;
  }
}

export default StorageManager;