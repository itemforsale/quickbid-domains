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
import { handleDomainBid, handleDomainBuyNow, createNewDomain, categorizeDomains } from "@/utils/domainUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDomains } from "@/utils/domainUpdates";
import { useAuctionUpdates } from "@/hooks/useAuctionUpdates";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { toast } from "sonner";
import { toISOString } from "@/types/dates";

const Index = () => {
  const { user, logout } = useUser();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  useAuctionUpdates();

  const { data: domains = [], isLoading, error } = useQuery({
    queryKey: ['domains'],
    queryFn: getDomains,
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const handleBid = async (domainId: number, amount: number) => {
    if (!user) {
      toast.error("Please login to place a bid");
      return;
    }
    
    try {
      const updatedDomains = await handleDomainBid(domains, domainId, amount, user.username);
      queryClient.setQueryData(['domains'], updatedDomains);
      toast.success("Bid placed successfully!");
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error("Failed to place bid. Please try again.");
    }
  };

  const handleBuyNow = async (domainId: number) => {
    if (!user) {
      toast.error("Please login to purchase the domain");
      return;
    }
    
    try {
      const updatedDomains = await handleDomainBuyNow(domains, domainId, user.username);
      queryClient.setQueryData(['domains'], updatedDomains);
      toast.success("Domain purchased successfully!");
    } catch (error) {
      console.error('Error purchasing domain:', error);
      toast.error("Failed to purchase domain. Please try again.");
    }
  };

  const handleDomainSubmission = async (name: string, startingPrice: number, buyNowPrice: number | null) => {
    if (!user) {
      toast.error("Please login to list a domain");
      return;
    }
    
    try {
      const newDomain = await createNewDomain(name, startingPrice, buyNowPrice, user.username);
      if (newDomain) {
        queryClient.setQueryData(['domains'], [...domains, newDomain]);
        toast.success("Domain submitted for auction!");
      }
    } catch (error) {
      console.error('Error submitting domain:', error);
      toast.error("Failed to submit domain. Please try again.");
    }
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

  // Filter active domains based on search query
  const filteredActiveDomains = activeDomains.filter(domain =>
    domain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userWonDomainsFormatted = userWonDomains.map(domain => ({
    id: domain.id,
    name: domain.name,
    finalPrice: domain.finalPrice || domain.currentBid,
    purchaseDate: domain.purchaseDate || toISOString(new Date()),
    listedBy: domain.listedBy
  }));

  return (
    <div className="min-h-screen bg-background text-foreground px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header onSearch={setSearchQuery} />
        <AboutBioBox />
        <Advertisement />
        
        <UserSection
          user={user}
          domains={domains}
          wonDomains={userWonDomainsFormatted}
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