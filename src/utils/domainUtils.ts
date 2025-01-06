import { Domain } from "@/types/domain";
import { supabase } from "@/integrations/supabase/client";

export const handleDomainBid = async (domains: Domain[], domainId: number, amount: number, username: string): Promise<Domain[]> => {
  const { data: domain, error: fetchError } = await supabase
    .from('domains')
    .select('*')
    .eq('id', domainId)
    .single();

  if (fetchError) {
    console.error('Error fetching domain:', fetchError);
    return domains;
  }

  const updatedBidHistory = [
    ...(domain.bid_history || []),
    { bidder: username, amount, timestamp: new Date() }
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

  if (updateError) {
    console.error('Error updating domain:', updateError);
    return domains;
  }

  return domains.map(d => d.id === domainId ? updatedDomain : d);
};

export const handleDomainBuyNow = async (domains: Domain[], domainId: number, username: string): Promise<Domain[]> => {
  const { data: domain, error: fetchError } = await supabase
    .from('domains')
    .select('*')
    .eq('id', domainId)
    .single();

  if (fetchError || !domain.buy_now_price) {
    console.error('Error fetching domain:', fetchError);
    return domains;
  }

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

  if (updateError) {
    console.error('Error updating domain:', updateError);
    return domains;
  }

  return domains.map(d => d.id === domainId ? updatedDomain : d);
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

  if (error) {
    console.error('Error creating domain:', error);
    return null;
  }

  return newDomain;
};

export const categorizeDomains = (domains: Domain[], now: Date, username?: string) => {
  return {
    pendingDomains: domains.filter(d => d.status === 'pending'),
    activeDomains: domains.filter(d => d.status === 'active'),
    endedDomains: domains.filter(d => {
      const endTime = getDateFromComplexStructure(d.endTime);
      return endTime < now && d.status !== 'sold';
    }),
    soldDomains: domains.filter(d => d.status === 'sold'),
    userWonDomains: domains.filter(d => d.currentBidder === username)
  };
};

export const getDateFromComplexStructure = (dateValue: Date | string | { value: { iso: string } }): Date => {
  if (dateValue instanceof Date) {
    return dateValue;
  }
  if (typeof dateValue === 'string') {
    return new Date(dateValue);
  }
  if (dateValue && typeof dateValue === 'object' && 'value' in dateValue && dateValue.value && 'iso' in dateValue.value) {
    return new Date(dateValue.value.iso);
  }
  return new Date();
};