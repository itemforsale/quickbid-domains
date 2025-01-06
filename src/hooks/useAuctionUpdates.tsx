import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Domain } from '@/types/domain';
import { broadcastManager } from '@/utils/broadcastManager';
import { toast } from 'sonner';

export const useAuctionUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up auction updates...');
    
    const handleDomainUpdate = (event: CustomEvent) => {
      if (event.detail.type === 'domains_updated') {
        console.log('Received domain update:', event.detail.data);
        queryClient.setQueryData(['domains'], event.detail.data);
        toast.success("Auction listings updated!");
      }
    };

    // Listen for updates from other tabs
    window.addEventListener('domain_update', handleDomainUpdate as EventListener);
    
    // Listen for WebSocket updates
    const wsCleanup = setupWebSocketListener((domains: Domain[]) => {
      console.log('Received WebSocket update:', domains);
      queryClient.setQueryData(['domains'], domains);
      broadcastManager.broadcast('domains_updated', domains);
      toast.success("New auction listings available!");
    });

    // Add visibility change listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible - refreshing data');
        queryClient.invalidateQueries({ queryKey: ['domains'] });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('domain_update', handleDomainUpdate as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      wsCleanup();
    };
  }, [queryClient]);
};

const setupWebSocketListener = (onUpdate: (domains: Domain[]) => void) => {
  console.log('Setting up WebSocket listener');
  const ws = new WebSocket('wss://api.60dna.com/ws');
  
  ws.onopen = () => {
    console.log('WebSocket connected');
    ws.send(JSON.stringify({ type: 'subscribe', channel: 'auctions' }));
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'auction_update') {
        console.log('Processing auction update:', data.domains);
        onUpdate(data.domains);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };
  
  return () => {
    console.log('Cleaning up WebSocket connection');
    ws.close();
  };
};