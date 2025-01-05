import { Domain } from "@/types/domain";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'domains'
      },
      async () => {
        // Fetch the latest data when any change occurs
        const { data: domains } = await supabase
          .from('domains')
          .select('*')
          .order('created_at', { ascending: false });

        if (domains) {
          const transformedDomains = domains.map((domain): Domain => ({
            id: domain.id,
            name: domain.name,
            currentBid: domain.current_bid,
            endTime: new Date(domain.end_time),
            bidHistory: domain.bid_history || [],
            status: domain.status,
            currentBidder: domain.current_bidder,
            bidTimestamp: domain.bid_timestamp ? new Date(domain.bid_timestamp) : undefined,
            buyNowPrice: domain.buy_now_price,
            finalPrice: domain.final_price,
            purchaseDate: domain.purchase_date ? new Date(domain.purchase_date) : undefined,
            featured: domain.featured,
            createdAt: new Date(domain.created_at),
            listedBy: domain.listed_by
          }));
          
          onUpdate(transformedDomains);
          toast.success("Domain listings updated!");
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const getDomains = async (): Promise<Domain[]> => {
  const { data: domains, error } = await supabase
    .from('domains')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching domains:', error);
    return [];
  }

  if (!domains) return [];

  return domains.map((domain): Domain => ({
    id: domain.id,
    name: domain.name,
    currentBid: domain.current_bid,
    endTime: new Date(domain.end_time),
    bidHistory: domain.bid_history || [],
    status: domain.status,
    currentBidder: domain.current_bidder,
    bidTimestamp: domain.bid_timestamp ? new Date(domain.bid_timestamp) : undefined,
    buyNowPrice: domain.buy_now_price,
    finalPrice: domain.final_price,
    purchaseDate: domain.purchase_date ? new Date(domain.purchase_date) : undefined,
    featured: domain.featured,
    createdAt: new Date(domain.created_at),
    listedBy: domain.listed_by
  }));
};