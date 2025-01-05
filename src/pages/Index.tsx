import { useState, useEffect } from "react";
import { DomainCard } from "@/components/DomainCard";
import { SearchBar } from "@/components/SearchBar";

interface Domain {
  id: number;
  name: string;
  currentBid: number;
  endTime: Date;
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
  }));
};

const Index = () => {
  const [domains, setDomains] = useState<Domain[]>(generateInitialDomains());
  const [searchQuery, setSearchQuery] = useState("");

  const handleBid = (domainId: number, amount: number) => {
    setDomains((prevDomains) =>
      prevDomains.map((domain) =>
        domain.id === domainId
          ? { ...domain, currentBid: amount }
          : domain
      )
    );
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
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
          {filteredDomains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain.name}
              initialPrice={100}
              endTime={domain.endTime}
              currentBid={domain.currentBid}
              onBid={(amount) => handleBid(domain.id, amount)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;