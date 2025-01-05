import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Domain } from "@/types/domain";
import { Header } from "@/components/index/Header";
import { UserSection } from "@/components/index/UserSection";
import { ActiveAuctions } from "@/components/index/ActiveAuctions";
import { SoldDomains } from "@/components/index/SoldDomains";
import { RecentlyEndedDomains } from "@/components/index/RecentlyEndedDomains";
import { AdminSection } from "@/components/index/AdminSection";
import { Advertisement } from "@/components/Advertisement";
import { AboutBioBox } from "@/components/AboutBioBox";
import { handleDomainBid, handleDomainBuyNow, createNewDomain } from "@/utils/domainUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDomains } from "@/utils/domainUpdates";
import { broadcastManager } from "@/utils/broadcastManager";
import { useAuctionUpdates } from "@/hooks/useAuctionUpdates";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";

const Index = () => {
  const { user, logout } = useUser();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Set up real-time updates
  useAuctionUpdates();

  // Use React Query for data fetching with automatic refresh
  const { data: domains = [], isLoading, error } = useQuery({
    queryKey: ['domains'],
    queryFn: getDomains,
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const handleBid = (domainId: number, amount: number) => {
    if (!user) return;
    const updatedDomains = handleDomainBid(domains, domainId, amount, user.username);
    queryClient.setQueryData(['domains'], updatedDomains);
    broadcastManager.broadcast('domains_updated', updatedDomains);
  };

  const handleBuyNow = (domainId: number) => {
    if (!user) return;
    const updatedDomains = handleDomainBuyNow(domains, domainId, user.username);
    queryClient.setQueryData(['domains'], updatedDomains);
    broadcastManager.broadcast('domains_updated', updatedDomains);
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

    const updatedDomains = [...domains, newDomain];
    queryClient.setQueryData(['domains'], updatedDomains);
    broadcastManager.broadcast('domains_updated', updatedDomains);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Error loading domains. Please try again later." />;

  const now = new Date();
  const { 
    pendingDomains,
    activeDomains,
    endedDomains,
    soldDomains,
    userWonDomains
  } = categorizeDomains(domains, now, user?.username);

  const filteredActiveDomains = activeDomains.filter(domain =>
    domain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto space-y-8">
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
          <AdminSection
            pendingDomains={pendingDomains}
            activeDomains={activeDomains}
            queryClient={queryClient}
          />
        )}

        <div className="space-y-8">
          {filteredActiveDomains.length > 0 && (
            <ActiveAuctions
              domains={filteredActiveDomains}
              onBid={handleBid}
              onBuyNow={handleBuyNow}
            />
          )}

          {endedDomains.length > 0 && (
            <RecentlyEndedDomains domains={endedDomains} />
          )}

          {soldDomains.length > 0 && (
            <SoldDomains domains={soldDomains} />
          )}

          {domains.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No domains available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;