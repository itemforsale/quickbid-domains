import { Domain } from "@/types/domain";

export interface DomainUpdate {
  type: 'domains_update' | 'request_initial_data' | 'heartbeat' | 'heartbeat_response';
  domains?: Domain[];
  timestamp?: number;
}

export interface StoredDomains {
  domains: Domain[];
  timestamp: number;
}