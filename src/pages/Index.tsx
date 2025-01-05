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

const STORAGE_KEY = 'quickbid_domains';

const Index = () => {
  const { user, logout } = useUser();
  const [domains, setDomains] = useState<Domain[]>(() => {
    const savedDomains = localStorage.getItem(STORAGE_KEY);
    if (savedDomains) {
      const parsedDomains = JSON.parse(savedDomains);
      return parsedDomains.map((domain: any) => ({
        ...domain,
        endTime: new Date(domain.endTime),
        createdAt: domain.createdAt ? new Date(domain.createdAt) : new Date(),
        bidTimestamp: domain.bidTimestamp ? new Date(domain.bidTimestamp) : undefined,
        purchaseDate: domain.purchaseDate ? new Date(domain.purchaseDate) : undefined,
        bidHistory: domain.bidHistory.map((bid: any) => ({
          ...bid,
          timestamp: new Date(bid.timestamp)
        })),
        listedBy: domain.listedBy || 'Anonymous', // Ensure listedBy has a fallback
      }));
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(domains));
  }, [domains]);

  const handleBid = (domainId: number, amount: number) => {
    if (!user) return;
    setDomains(prevDomains => handleDomainBid(prevDomains, domainId, amount, user.username));
  };

  const handleBuyNow = (domainId: number) => {
    if (!user) return;
    setDomains(prevDomains => handleDomainBuyNow(prevDomains, domainId, user.username));
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

    setDomains(prevDomains => [...prevDomains, newDomain]);
  };

  const handleDeleteListing = (domainId: number) => {
    setDomains((prevDomains) => prevDomains.filter((domain) => domain.id !== domainId));
  };

  const handleFeatureDomain = (domainId: number) => {
    setDomains((prevDomains) =>
      prevDomains.map((domain) =>
        domain.id === domainId
          ? { ...domain, featured: !domain.featured }
          : domain
      )
    );
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
      listedBy: d.listedBy || 'Anonymous', // Ensure listedBy has a fallback
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
            onApproveDomain={(id) => setDomains(prevDomains =>
              prevDomains.map(domain =>
                domain.id === id ? { ...domain, status: 'active' } : domain
              )
            )}
            onRejectDomain={(id) => setDomains(prevDomains =>
              prevDomains.filter(domain => domain.id !== id)
            )}
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
