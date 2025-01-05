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
        }))
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

    setDomains((prevDomains) =>
      prevDomains.map((domain) => {
        if (domain.id === domainId) {
          const updatedDomain = {
            ...domain,
            currentBid: amount,
            currentBidder: user.username,
            bidTimestamp: new Date(),
            bidHistory: [
              ...domain.bidHistory,
              {
                bidder: user.username,
                amount: amount,
                timestamp: new Date(),
              },
            ],
          };

          if (domain.buyNowPrice && amount >= domain.buyNowPrice) {
            return {
              ...updatedDomain,
              status: 'sold',
              finalPrice: amount,
              purchaseDate: new Date(),
              listedBy: domain.listedBy, // Ensure listedBy is preserved
            };
          }

          return updatedDomain;
        }
        return domain;
      })
    );
  };

  const handleBuyNow = (domainId: number) => {
    if (!user) return;

    setDomains((prevDomains) =>
      prevDomains.map((domain) => {
        if (domain.id === domainId && domain.buyNowPrice) {
          return {
            ...domain,
            status: 'sold',
            currentBid: domain.buyNowPrice,
            currentBidder: user.username,
            finalPrice: domain.buyNowPrice,
            purchaseDate: new Date(),
            listedBy: domain.listedBy, // Ensure listedBy is preserved
          };
        }
        return domain;
      })
    );
  };

  const handleDomainSubmission = (domainName: string, startingPrice: number, buyNowPrice: number | null) => {
    if (!user) return;
    
    const newDomain: Domain = {
      id: domains.length + 1,
      name: domainName,
      currentBid: startingPrice,
      endTime: new Date(Date.now() + 60 * 60000),
      bidHistory: [],
      status: 'pending',
      buyNowPrice: buyNowPrice || undefined,
      createdAt: new Date(),
      listedBy: user.username,
    };

    setDomains((prevDomains) => [...prevDomains, newDomain]);
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
  
  const activeDomains = domains.filter(d => {
    return d.status === 'active' && d.endTime > now;
  });

  const endedDomains = domains.filter(d => {
    return d.status === 'active' && d.endTime <= now && d.bidHistory.length === 0;
  });

  const soldDomains = domains.filter(d => {
    return (
      d.status === 'sold' || 
      (d.status === 'active' && d.endTime <= now && d.bidHistory.length > 0)
    );
  });

  const userWonDomains = soldDomains
    .filter(d => d.currentBidder === user?.username)
    .map(d => ({
      id: d.id,
      name: d.name,
      finalPrice: d.finalPrice!,
      purchaseDate: d.purchaseDate!,
      listedBy: d.listedBy,
    }));

  const filteredActiveDomains = activeDomains.filter((domain) =>
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