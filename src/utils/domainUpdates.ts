import { supabase } from "@/integrations/supabase/client";
import { Domain } from "@/types/domain";
import { SupabaseDomain, mapSupabaseToDomain, mapDomainToSupabase } from "@/types/supabase";

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  const channel = supabase
    .channel('public:domains')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'domains' 
      }, 
      (payload) => {
        console.log('Received realtime update:', payload);
        getDomains().then(domains => {
          if (domains) onUpdate(domains);
        });
      }
    )
    .subscribe();

  getDomains().then(domains => {
    if (domains) onUpdate(domains);
  });

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

export const updateDomains = async (domains: Domain[]) => {
  try {
    const supabaseDomains = domains.map(domain => mapDomainToSupabase(domain));
    
    const { error } = await supabase
      .from('domains')
      .upsert(supabaseDomains);

    if (error) {
      console.error('Error updating domains:', error);
    }
  } catch (error) {
    console.error('Error saving domains:', error);
  }
};