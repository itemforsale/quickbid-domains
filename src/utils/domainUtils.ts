import { Domain } from "@/types/domain";
import { supabase } from "@/integrations/supabase/client";

export const handleDomainBid = async (
  domains: Domain[],
  domainId: number,
  amount: number,
  username: string
): Promise<Domain[]> => {
  const domain = domains.find((d) => d.id === domainId);
  if (!domain) return domains;

  const bidHistory = [
    ...(domain.bidHistory || []),
    { bidder: username, amount, timestamp: new Date() }
  ];

  const { data, error } = await supabase
    .from('domains')
    .update({
      current_bid: amount,
      current_bidder: username,
      bid_timestamp: new Date().toISOString(),
      bid_history: bidHistory
    })
    .eq('id', domainId)
    .select()
    .single();

  if (error) {
    console.error('Error updating domain:', error);
    return domains;
  }

  return domains.map(d => d.id === domainId ? {
    ...d,
    currentBid: amount,
    currentBidder: username,
    bidTimestamp: new Date(),
    bidHistory
  } : d);
};

export const handleDomainBuyNow = async (
  domains: Domain[],
  domainId: number,
  username: string
): Promise<Domain[]> => {
  const domain = domains.find((d) => d.id === domainId);
  if (!domain || !domain.buyNowPrice) return domains;

  const { error } = await supabase
    .from('domains')
    .update({
      status: 'sold',
      current_bidder: username,
      final_price: domain.buyNowPrice,
      purchase_date: new Date().toISOString()
    })
    .eq('id', domainId);

  if (error) {
    console.error('Error updating domain:', error);
    return domains;
  }

  return domains.map(d => d.id === domainId ? {
    ...d,
    status: 'sold',
    currentBidder: username,
    finalPrice: domain.buyNowPrice,
    purchaseDate: new Date()
  } : d);
};

export const createNewDomain = async (
  id: number,
  name: string,
  startingPrice: number,
  buyNowPrice: number | null,
  username: string
): Promise<Domain> => {
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 24); // 24-hour auction

  const newDomain = {
    name,
    current_bid: startingPrice,
    end_time: endTime.toISOString(),
    buy_now_price: buyNowPrice,
    status: 'active',
    listed_by: username
  };

  const { data, error } = await supabase
    .from('domains')
    .insert(newDomain)
    .select()
    .single();

  if (error) {
    console.error('Error creating domain:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    currentBid: data.current_bid,
    endTime: new Date(data.end_time),
    bidHistory: [],
    status: 'active',
    buyNowPrice: data.buy_now_price,
    featured: false,
    createdAt: new Date(data.created_at),
    listedBy: data.listed_by
  };
};