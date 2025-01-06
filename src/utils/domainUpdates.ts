import { supabase } from "@/integrations/supabase/client";
import { Domain } from "@/types/domain";
import { SupabaseDomain, mapSupabaseToDomain } from "@/types/supabase";

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  const channel = supabase
    .channel('public:domains')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'domains' 
      }, 
      async () => {
        const domains = await getDomains();
        onUpdate(domains);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const getDomains = async (): Promise<Domain[]> => {
  try {
    const { data, error } = await supabase
      .from('domains')
      .select('*');

    if (error) {
      console.error('Error fetching domains:', error);
      return [];
    }

    return (data as SupabaseDomain[]).map(mapSupabaseToDomain);
  } catch (error) {
    console.error('Error loading domains:', error);
    return [];
  }
};

export const updateDomain = async (domain: Domain) => {
  try {
    const { error } = await supabase
      .from('domains')
      .update({
        current_bid: domain.currentBid,
        current_bidder: domain.currentBidder,
        bid_history: domain.bidHistory,
        bid_timestamp: domain.bidTimestamp,
        status: domain.status,
        final_price: domain.finalPrice,
        purchase_date: domain.purchaseDate
      })
      .eq('id', domain.id);

    if (error) {
      console.error('Error updating domain:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error saving domain:', error);
    throw error;
  }
};