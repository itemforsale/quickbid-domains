import { Domain } from "@/types/domain";
import { supabase } from "@/integrations/supabase/client";

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  // Subscribe to realtime updates
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

  // Initial load
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
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching domains:', error);
      return [];
    }

    console.log('Retrieved domains:', data);
    return data || [];
  } catch (error) {
    console.error('Error loading domains:', error);
    return [];
  }
};

export const updateDomains = async (domains: Domain[]) => {
  try {
    console.log('Updating domains:', domains);
    const { error } = await supabase
      .from('domains')
      .upsert(domains);

    if (error) {
      console.error('Error updating domains:', error);
    }
  } catch (error) {
    console.error('Error saving domains:', error);
  }
};