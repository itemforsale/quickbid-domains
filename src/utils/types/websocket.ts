import { Domain } from "@/types/domain";

export interface WebSocketMessage {
  type: 'domains_update' | 'initial_data' | 'error';
  domains?: Domain[];
  error?: string;
}