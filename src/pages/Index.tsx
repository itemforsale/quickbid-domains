import { useState, useEffect } from "react";
import { DomainCard } from "@/components/DomainCard";
import { SearchBar } from "@/components/SearchBar";
import { DomainSubmissionForm } from "@/components/DomainSubmissionForm";
import { UserProfile } from "@/components/UserProfile";
import { AdminPanel } from "@/components/AdminPanel";
import { PendingDomains } from "@/components/PendingDomains";
import { NotificationBell } from "@/components/NotificationBell";
import { AuthDialogs } from "@/components/AuthDialogs";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Domain } from "@/types/domain";

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

  const handleApproveDomain = (domainId: number) => {
    setDomains((prevDomains) =>
      prevDomains.map((domain) =>
        domain.id === domainId ? { ...domain, status: 'active' } : domain
      )
    );
  };

  const handleRejectDomain = (domainId: number) => {
    setDomains((prevDomains) =>
      prevDomains.filter((domain) => domain.id !== domainId)
    );
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
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Domains
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Exclusive domains available for auction
          </p>
          
          {user ? (
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-8">
                <p className="text-gray-700">
                  Welcome, <span className="font-semibold">{user.username}</span>!
                </p>
                <NotificationBell username={user.username} domains={domains} />
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
              <DomainSubmissionForm onSubmit={handleDomainSubmission} />
              <UserProfile username={user.username} wonDomains={userWonDomains} />
            </div>
          ) : (
            <AuthDialogs />
          )}
          
          <div className="mt-8">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>

        {user?.isAdmin && (
          <AdminPanel
            pendingDomains={pendingDomains}
            onApproveDomain={handleApproveDomain}
            onRejectDomain={handleRejectDomain}
          />
        )}

        <PendingDomains domains={pendingDomains} />

        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Active Auctions</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
              {filteredActiveDomains.map((domain) => (
                <DomainCard
                  key={domain.id}
                  domain={domain.name}
                  initialPrice={domain.currentBid}
                  endTime={domain.endTime}
                  currentBid={domain.currentBid}
                  currentBidder={domain.currentBidder}
                  bidTimestamp={domain.bidTimestamp}
                  bidHistory={domain.bidHistory}
                  buyNowPrice={domain.buyNowPrice}
                  onBid={(amount) => handleBid(domain.id, amount)}
                  onBuyNow={() => handleBuyNow(domain.id)}
                />
              ))}
            </div>
          </div>

          {soldDomains.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Recently Sold</h2>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {soldDomains.map((domain) => (
                  <Card key={domain.id} className="p-4 backdrop-blur-sm bg-white/50 border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{domain.name}</h3>
                        <span className="text-green-600 font-medium">${domain.finalPrice}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Sold to @{domain.currentBidder}
                      </p>
                      <p className="text-xs text-gray-400">
                        {domain.purchaseDate?.toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
