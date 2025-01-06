import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Domain } from "@/types/domain";
import { Header } from "@/components/index/Header";
import { UserSection } from "@/components/index/UserSection";
import { AdminSection } from "@/components/index/AdminSection";
import { Advertisement } from "@/components/Advertisement";
import { AboutBioBox } from "@/components/AboutBioBox";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDomains } from "@/utils/domainUpdates";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { toast } from "sonner";
import { DomainCard } from "@/components/DomainCard";

const Index = () => {
  const { user, logout } = useUser();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: domains = [], isLoading, error } = useQuery({
    queryKey: ['domains'],
    queryFn: getDomains,
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const handlePurchase = async (domainId: number) => {
    if (!user) {
      toast.error("Please login to purchase the domain");
      return;
    }
    
    try {
      // Update domain status to sold
      const response = await fetch(`/api/domains/${domainId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) throw new Error('Failed to purchase domain');
      
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast.success("Domain purchased successfully!");
    } catch (error) {
      console.error('Error purchasing domain:', error);
      toast.error("Failed to purchase domain. Please try again.");
    }
  };

  const handleDomainSubmission = async (name: string, price: number) => {
    if (!user) {
      toast.error("Please login to list a domain");
      return;
    }
    
    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price, listedBy: user.id }),
      });

      if (!response.ok) throw new Error('Failed to submit domain');
      
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast.success("Domain submitted for listing!");
    } catch (error) {
      console.error('Error submitting domain:', error);
      toast.error("Failed to submit domain. Please try again.");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Error loading domains. Please try again later." />;

  // Filter domains based on search query
  const filteredDomains = domains.filter(domain =>
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
          onLogout={logout}
          onDomainSubmit={handleDomainSubmission}
        />

        {user?.isAdmin && (
          <AdminSection
            domains={domains}
            queryClient={queryClient}
          />
        )}

        <div className="space-y-8">
          {filteredDomains.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDomains.map((domain) => (
                <DomainCard
                  key={domain.id}
                  domain={domain.name}
                  price={domain.price}
                  onPurchase={() => handlePurchase(domain.id)}
                  featured={domain.featured}
                  createdAt={domain.createdAt ? new Date(domain.createdAt) : undefined}
                  listedBy={domain.listedBy}
                />
              ))}
            </div>
          ) : (
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