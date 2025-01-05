import { useState } from "react";
import { DomainCard } from "@/components/DomainCard";
import { SearchBar } from "@/components/SearchBar";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { DomainSubmissionForm } from "@/components/DomainSubmissionForm";
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
      prevDomains.map((domain) =>
        domain.id === domainId
          ? {
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
            }
          : domain
      )
    );
  };

  const handleDomainSubmission = (domainName: string) => {
    const newDomain: Domain = {
      id: domains.length + 1,
      name: domainName,
      currentBid: 100, // Starting bid
      endTime: new Date(Date.now() + 60 * 60000), // 1 hour from now
      bidHistory: [],
    };

    setDomains((prevDomains) => [...prevDomains, newDomain]);
  };

  const filteredDomains = domains.filter((domain) =>
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
            Exclusive domains available for the next 60 minutes
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
          {filteredDomains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain.name}
              initialPrice={100}
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
    </div>
  );
};

export default Index;