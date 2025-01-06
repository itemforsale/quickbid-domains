import { Json } from "@/integrations/supabase/types";

export type DomainStatus = "pending" | "active" | "featured" | "sold";

export interface Domain {
  id: number;
  name: string;
  price: number;
  status: DomainStatus;
  featured?: boolean;
  createdAt?: string;
  listedBy: string;
  purchaseDate?: string;
}

export interface DomainDB {
  id: number;
  name: string;
  price: number;
  status: DomainStatus;
  featured: boolean;
  created_at?: string;
  listed_by: string;
  purchase_date?: string;
}