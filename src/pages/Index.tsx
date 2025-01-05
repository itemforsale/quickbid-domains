import { useState } from "react";
import { DomainCard } from "@/components/DomainCard";
import { SearchBar } from "@/components/SearchBar";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { DomainSubmissionForm } from "@/components/DomainSubmissionForm";
import { UserProfile } from "@/components/UserProfile";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";

interface Bid {
  bidder: string;
  amount: number;
  timestamp: Date;
}

interface Domain {
  id: number;
  name: string;
  currentBid: number;
  currentBidder?: string;
  bidTimestamp?: Date;
  endTime: Date;
  bidHistory: Bid[];
  buyNowPrice?: number;
  status: 'active' | 'sold';
  finalPrice?: number;
  purchaseDate?: Date;
}

const generateInitialDomains = (): Domain[] => {
  const domains = [
    "premium.com",
    "startup.io",
    "brand.co",
    "tech.app",
    "market.io",
    "crypto.net",
  ];

  return domains.map((domain, index) => ({
    id: index + 1,
    name: domain,
    currentBid: Math.floor(Math.random() * 1000) + 100,
    endTime: new Date(Date.now() + (Math.random() * 30 + 30) * 60000),
    bidHistory: [],
    status: 'active',
  }));
};

const Index = () => {
  const { user, logout } = useUser();
  const [domains, setDomains] = useState<Domain[]>(generateInitialDomains());
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(true);

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

          // Check if bid meets buy now price
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

  const handleDomainSubmission = (domainName: string, startingPrice: number, buyNowPrice: number | null) => {
    const newDomain: Domain = {
      id: domains.length + 1,
      name: domainName,
      currentBid: startingPrice,
      endTime: new Date(Date.now() + 60 * 60000), // 1 hour from now
      bidHistory: [],
      status: 'active',
      buyNowPrice: buyNowPrice || undefined,
    };

    setDomains((prevDomains) => [...prevDomains, newDomain]);
  };

  const activeDomains = domains.filter(d => d.status === 'active');
  const soldDomains = domains.filter(d => d.status === 'sold');
  const userWonDomains = soldDomains.filter(d => d.currentBidder === user?.username)
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
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
              <DomainSubmissionForm onSubmit={handleDomainSubmission} />
              <UserProfile username={user.username} wonDomains={userWonDomains} />
            </div>
          ) : (
            <div className="mb-8">
              <div className="flex justify-center gap-4 mb-4">
                <Button
                  variant={showLogin ? "default" : "outline"}
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </Button>
                <Button
                  variant={!showLogin ? "default" : "outline"}
                  onClick={() => setShowLogin(false)}
                >
                  Register
                </Button>
              </div>
              {showLogin ? <LoginForm /> : <RegisterForm />}
            </div>
          )}
          
          <div className="mt-8">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>

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
                  onBid={(amount) => handleBid(domain.id, amount)}
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