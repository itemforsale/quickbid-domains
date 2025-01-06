import { Domain, BidHistoryItem } from "@/types/domain";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export const formatDate = (date: string | Date): Date => {
  return date instanceof Date ? date : new Date(date);
};

export const handleDomainBid = async (domains: Domain[], domainId: number, amount: number, username: string): Promise<Domain[]> => {
  const { data: domain, error: fetchError } = await supabase
    .from('domains')
    .select('*')
    .eq('id', domainId)
    .single();

  if (fetchError) throw fetchError;

  const updatedBidHistory = [
    ...(domain.bid_history || []),
    { bidder: username, amount, timestamp: new Date().toISOString() }
  ];

  const { data: updatedDomain, error: updateError } = await supabase
    .from('domains')
    .update({
      current_bid: amount,
      current_bidder: username,
      bid_history: updatedBidHistory,
      bid_timestamp: new Date().toISOString()
    })
    .eq('id', domainId)
    .select()
    .single();

  if (updateError) throw updateError;

  return domains.map(d => d.id === domainId ? {
    ...d,
    currentBid: amount,
    currentBidder: username,
    bidHistory: updatedBidHistory,
    bidTimestamp: new Date().toISOString()
  } : d);
};

export const handleDomainBuyNow = async (domains: Domain[], domainId: number, username: string): Promise<Domain[]> => {
  const { data: domain, error: fetchError } = await supabase
    .from('domains')
    .select('*')
    .eq('id', domainId)
    .single();

  if (fetchError || !domain.buy_now_price) throw fetchError;

  const { data: updatedDomain, error: updateError } = await supabase
    .from('domains')
    .update({
      status: 'sold',
      current_bidder: username,
      final_price: domain.buy_now_price,
      purchase_date: new Date().toISOString()
    })
    .eq('id', domainId)
    .select()
    .single();

  if (updateError) throw updateError;

  return domains.map(d => d.id === domainId ? {
    ...d,
    status: 'sold',
    currentBidder: username,
    finalPrice: domain.buy_now_price,
    purchaseDate: new Date().toISOString()
  } : d);
};

export const createNewDomain = async (
  name: string,
  startingPrice: number,
  buyNowPrice: number | null,
  listedBy: string
): Promise<Domain | null> => {
  const { data: newDomain, error } = await supabase
    .from('domains')
    .insert({
      name,
      current_bid: startingPrice,
      end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      bid_history: [],
      status: 'pending',
      buy_now_price: buyNowPrice,
      listed_by: listedBy,
      featured: false
    })
    .select()
    .single();

  if (error) throw error;

  return newDomain ? {
    id: newDomain.id,
    name: newDomain.name,
    currentBid: newDomain.current_bid,
    endTime: new Date(newDomain.end_time),
    bidHistory: newDomain.bid_history || [],
    status: newDomain.status,
    buyNowPrice: newDomain.buy_now_price,
    listedBy: newDomain.listed_by,
    featured: newDomain.featured,
    createdAt: newDomain.created_at,
    isFixedPrice: newDomain.is_fixed_price
  } : null;
};

export const categorizeDomains = (domains: Domain[], now: Date, username?: string) => {
  return {
    pendingDomains: domains.filter(d => d.status === 'pending'),
    activeDomains: domains.filter(d => d.status === 'active'),
    endedDomains: domains.filter(d => formatDate(d.endTime) < now && d.status !== 'sold'),
    soldDomains: domains.filter(d => d.status === 'sold'),
    userWonDomains: domains.filter(d => d.currentBidder === username)
  };
};