import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Domain } from "@/types/domain";
import { Header } from "@/components/index/Header";
import { UserSection } from "@/components/index/UserSection";
import { ActiveAuctions } from "@/components/index/ActiveAuctions";
import { SoldDomains } from "@/components/index/SoldDomains";
import { AdminPanel } from "@/components/AdminPanel";
import { PendingDomains } from "@/components/PendingDomains";

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
          };
        }
        return domain;
      })
    );
  };

  const handleDomainSubmission = (domainName: string, startingPrice: number, buyNowPrice: number | null) => {
    const newDomain: Domain = {
      id: domains.length + 1,
      name: domainName,
      currentBid: startingPrice,
      endTime: new Date(Date.now() + 60 * 60000),
      bidHistory: [],
      status: 'pending',
      buyNowPrice: buyNowPrice || undefined,
    };

    setDomains((prevDomains) => [...prevDomains, newDomain]);
  };

  const handleDeleteListing = (domainId: number) => {
    setDomains((prevDomains) => prevDomains.filter((domain) => domain.id !== domainId));
  };

  const pendingDomains = domains.filter(d => d.status === 'pending');
  const activeDomains = domains.filter(d => d.status === 'active');
  const soldDomains = domains.filter(d => d.status === 'sold');
  const userWonDomains = soldDomains
    .filter(d => d.currentBidder === user?.username)
    .map(d => ({
      id: d.id,
      name: d.name,
      finalPrice: d.finalPrice!,
      purchaseDate: d.purchaseDate!,
    }));

  const filteredActiveDomains = activeDomains.filter((domain) =>
    domain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header onSearch={setSearchQuery} />
        
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
          />
        )}

        <PendingDomains domains={pendingDomains} />

        <div className="space-y-12">
          <ActiveAuctions
            domains={filteredActiveDomains}
            onBid={handleBid}
            onBuyNow={handleBuyNow}
          />

          <SoldDomains domains={soldDomains} />
        </div>
      </div>
    </div>
  );
};

export default Index;
