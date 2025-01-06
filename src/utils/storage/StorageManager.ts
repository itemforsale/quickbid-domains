import { supabase } from "@/integrations/supabase/client";
import { Domain } from "@/types/domain";
import { SupabaseDomain, mapDomainToSupabase, mapSupabaseToDomain } from "@/types/supabase";

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

      if (error) {
        console.error('Error fetching domains:', error);
        return [];
      }

      return (data as SupabaseDomain[]).map(mapSupabaseToDomain);
    } catch (error) {
      console.error('Error loading domains:', error);
      return [];
    }
  }

  async saveDomains(domains: Domain[]): Promise<void> {
    try {
      const supabaseDomains = domains.map(mapDomainToSupabase);
      
      const { error } = await supabase
        .from('domains')
        .upsert(supabaseDomains);

      if (error) {
        console.error('Error saving domains:', error);
      }
    } catch (error) {
      console.error('Error saving domains:', error);
    }
  }

  async getUsers(): Promise<any[]> {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return profiles || [];
  }

  async saveUsers(users: any[]): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .upsert(users);

    if (error) {
      console.error('Error saving users:', error);
    }
  }
}

export default StorageManager;