import { Domain } from "@/types/domain";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'domains'
      },
      async () => {
        const domains = await getDomains();
        onUpdate(domains);
        toast.success("Domain listings updated!");
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const getDomains = async (): Promise<Domain[]> => {
  try {
    const { data: domains, error } = await supabase
      .from('domains')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching domains:', error);
      throw error;
    }

    if (!domains) return [];

    return domains.map((domain): Domain => ({
      id: parseInt(domain.id),
      name: domain.name,
      currentBid: domain.current_bid,
      endTime: new Date(domain.end_time),
      bidHistory: domain.bid_history || [],
      status: domain.status,
      currentBidder: domain.current_bidder || undefined,
      bidTimestamp: domain.bid_timestamp ? new Date(domain.bid_timestamp) : undefined,
      buyNowPrice: domain.buy_now_price || undefined,
      finalPrice: domain.final_price || undefined,
      purchaseDate: domain.purchase_date ? new Date(domain.purchase_date) : undefined,
      featured: domain.featured,
      createdAt: new Date(domain.created_at),
      listedBy: domain.listed_by
    }));
  } catch (error) {
    console.error('Error fetching domains:', error);
    throw error;
  }
};