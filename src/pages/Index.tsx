import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Domain } from "@/types/domain";
import { Header } from "@/components/index/Header";
import { UserSection } from "@/components/index/UserSection";
import { ActiveAuctions } from "@/components/index/ActiveAuctions";
import { SoldDomains } from "@/components/index/SoldDomains";
import { RecentlyEndedDomains } from "@/components/index/RecentlyEndedDomains";
import { AdminPanel } from "@/components/AdminPanel";
import { PendingDomains } from "@/components/PendingDomains";
import { Advertisement } from "@/components/Advertisement";
import { AboutBioBox } from "@/components/AboutBioBox";
import { handleDomainBid, handleDomainBuyNow, createNewDomain } from "@/utils/domainUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDomains, setupWebSocket } from "@/utils/domainUpdates";
import { toast } from "sonner";

const STORAGE_KEY = 'quickbid_domains';
const REFRESH_INTERVAL = 10000; // Refresh every 10 seconds

const Index = () => {
  const { user, logout } = useUser();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    const cleanup = setupWebSocket((updatedDomains) => {
      queryClient.setQueryData(['domains'], updatedDomains);
      toast.success("Domain listings updated!");
    });

    return cleanup;
  }, [queryClient]);

  // Use React Query for data fetching with automatic refresh
  const { data: domains = [] } = useQuery({
    queryKey: ['domains'],
    queryFn: getDomains,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 5000, // Consider data stale after 5 seconds
  });

  // Save domains to localStorage whenever they change
  useEffect(() => {
    if (domains) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(domains));
    }
  }, [domains]);

  const handleBid = (domainId: number, amount: number) => {
    if (!user) return;
    const updatedDomains = handleDomainBid(domains, domainId, amount, user.username);
    queryClient.setQueryData(['domains'], updatedDomains);
  };

  const handleBuyNow = (domainId: number) => {
    if (!user) return;
    const updatedDomains = handleDomainBuyNow(domains, domainId, user.username);
    queryClient.setQueryData(['domains'], updatedDomains);
  };

  const handleDomainSubmission = (name: string, startingPrice: number, buyNowPrice: number | null) => {
    if (!user) return;
    
    const newDomain = createNewDomain(
      domains.length + 1,
      name,
      startingPrice,
      buyNowPrice,
      user.username
    );

    queryClient.setQueryData(['domains'], [...domains, newDomain]);
  };

  const handleDeleteListing = (domainId: number) => {
    const updatedDomains = domains.filter((domain) => domain.id !== domainId);
    queryClient.setQueryData(['domains'], updatedDomains);
  };

  const handleFeatureDomain = (domainId: number) => {
    const updatedDomains = domains.map((domain) =>
      domain.id === domainId
        ? { ...domain, featured: !domain.featured }
        : domain
    );
    queryClient.setQueryData(['domains'], updatedDomains);
  };

  const now = new Date();

  const pendingDomains = domains.filter(d => d.status === 'pending');
  
  const activeDomains = domains.filter(d => 
    d.status === 'active' && d.endTime > now
  );

  const endedDomains = domains.filter(d => 
    d.status === 'active' && d.endTime <= now && d.bidHistory.length === 0
  );

  const soldDomains = domains.filter(d => 
    d.status === 'sold' || 
    (d.status === 'active' && d.endTime <= now && d.bidHistory.length > 0)
  );

  const userWonDomains = soldDomains
    .filter(d => d.currentBidder === user?.username)
    .map(d => ({
      id: d.id,
      name: d.name,
      finalPrice: d.finalPrice!,
      purchaseDate: d.purchaseDate!,
      listedBy: d.listedBy || 'Anonymous',
    }));

  const filteredActiveDomains = activeDomains.filter(domain =>
    domain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header onSearch={setSearchQuery} />
        <AboutBioBox />
        <Advertisement />
        
        <UserSection
          user={user}
          domains={domains}
          wonDomains={userWonDomains}
          onLogout={logout}
          onDomainSubmit={handleDomainSubmission}
        />

        {user?.isAdmin && (
          <AdminPanel
            pendingDomains={pendingDomains}
            activeDomains={activeDomains}
            onApproveDomain={(id) => {
              const updatedDomains = domains.map(domain =>
                domain.id === id ? { ...domain, status: 'active' } : domain
              );
              queryClient.setQueryData(['domains'], updatedDomains);
            }}
            onRejectDomain={(id) => {
              const updatedDomains = domains.filter(domain => domain.id !== id);
              queryClient.setQueryData(['domains'], updatedDomains);
            }}
            onDeleteListing={handleDeleteListing}
            onFeatureDomain={handleFeatureDomain}
          />
        )}

        <PendingDomains domains={pendingDomains} />

        <div className="space-y-12">
          <ActiveAuctions
            domains={filteredActiveDomains}
            onBid={handleBid}
            onBuyNow={handleBuyNow}
          />

          <RecentlyEndedDomains domains={endedDomains} />

          <SoldDomains domains={soldDomains} />
        </div>
      </div>
    </div>
  );
};

export default Index;
