import { Domain, BidHistoryItem, DomainDB } from "@/types/domain";
import { supabase } from "@/integrations/supabase/client";
import { toISOString } from "@/types/dates";

const transformDomainToDb = (domain: Domain): Partial<DomainDB> => ({
  name: domain.name,
  current_bid: domain.currentBid,
  end_time: domain.endTime,
  bid_history: domain.bidHistory,
  status: domain.status,
  current_bidder: domain.currentBidder,
  bid_timestamp: domain.bidTimestamp,
  buy_now_price: domain.buyNowPrice,
  final_price: domain.finalPrice,
  purchase_date: domain.purchaseDate,
  featured: domain.featured,
  created_at: domain.createdAt,
  listed_by: domain.listedBy,
  is_fixed_price: domain.isFixedPrice
});

const transformDbToDomain = (dbDomain: DomainDB): Domain => ({
  id: dbDomain.id,
  name: dbDomain.name,
  currentBid: dbDomain.current_bid,
  endTime: dbDomain.end_time,
  bidHistory: dbDomain.bid_history || [],
  status: dbDomain.status,
  currentBidder: dbDomain.current_bidder,
  bidTimestamp: dbDomain.bid_timestamp,
  buyNowPrice: dbDomain.buy_now_price,
  finalPrice: dbDomain.final_price,
  purchaseDate: dbDomain.purchase_date,
  featured: dbDomain.featured,
  createdAt: dbDomain.created_at,
  listedBy: dbDomain.listed_by,
  isFixedPrice: dbDomain.is_fixed_price
});

export const handleDomainBid = async (
  domains: Domain[],
  domainId: number,
  amount: number,
  username: string
): Promise<Domain[]> => {
  const { data: domain, error: fetchError } = await supabase
    .from('domains')
    .select('*')
    .eq('id', domainId)
    .single();

  if (fetchError) throw fetchError;

  const newBid: BidHistoryItem = {
    bidder: username,
    amount,
    timestamp: toISOString(new Date())
  };

  const currentBidHistory: BidHistoryItem[] = domain.bid_history || [];
  const updatedBidHistory = [...currentBidHistory, newBid];

  const { data: updatedDomain, error: updateError } = await supabase
    .from('domains')
    .update({
      current_bid: amount,
      current_bidder: username,
      bid_history: updatedBidHistory,
      bid_timestamp: toISOString(new Date())
    })
    .eq('id', domainId)
    .select()
    .single();

  if (updateError) throw updateError;

  return domains.map(d => d.id === domainId ? transformDbToDomain(updatedDomain) : d);
};

export const handleDomainBuyNow = async (
  domains: Domain[],
  domainId: number,
  username: string
): Promise<Domain[]> => {
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
      purchase_date: toISOString(new Date())
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
    purchaseDate: toISOString(new Date())
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
      end_time: toISOString(new Date(Date.now() + 24 * 60 * 60 * 1000)),
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
    endTime: newDomain.end_time,
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
    endedDomains: domains.filter(d => new Date(d.endTime) < now && d.status !== 'sold'),
    soldDomains: domains.filter(d => d.status === 'sold'),
    userWonDomains: domains.filter(d => d.currentBidder === username)
  };
};
