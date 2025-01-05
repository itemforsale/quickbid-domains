export type Database = {
  public: {
    Tables: {
      domains: {
        Row: {
          id: string
          name: string
          current_bid: number
          end_time: string
          bid_history: {
            bidder: string
            amount: number
            timestamp: string
          }[]
          status: 'pending' | 'active' | 'sold'
          current_bidder: string | null
          bid_timestamp: string | null
          buy_now_price: number | null
          final_price: number | null
          purchase_date: string | null
          featured: boolean
          created_at: string
          listed_by: string
        }
        Insert: {
          id?: string
          name: string
          current_bid: number
          end_time: string
          bid_history?: {
            bidder: string
            amount: number
            timestamp: string
          }[]
          status?: 'pending' | 'active' | 'sold'
          current_bidder?: string | null
          bid_timestamp?: string | null
          buy_now_price?: number | null
          final_price?: number | null
          purchase_date?: string | null
          featured?: boolean
          created_at?: string
          listed_by: string
        }
        Update: {
          id?: string
          name?: string
          current_bid?: number
          end_time?: string
          bid_history?: {
            bidder: string
            amount: number
            timestamp: string
          }[]
          status?: 'pending' | 'active' | 'sold'
          current_bidder?: string | null
          bid_timestamp?: string | null
          buy_now_price?: number | null
          final_price?: number | null
          purchase_date?: string | null
          featured?: boolean
          created_at?: string
          listed_by?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          email: string | null
          x_username: string | null
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          email?: string | null
          x_username?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          email?: string | null
          x_username?: string | null
          created_at?: string
        }
      }
    }
  }
}